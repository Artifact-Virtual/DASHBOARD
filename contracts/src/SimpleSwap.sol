// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SimpleSwap
 * @dev A basic DEX contract for swapping ERC20 tokens with automated market making
 * Built for ARCx ecosystem and Base network integration
 */
contract SimpleSwap is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    struct Pool {
        address tokenA;
        address tokenB;
        uint256 reserveA;
        uint256 reserveB;
        uint256 fee; // Fee in basis points (100 = 1%)
        bool active;
    }

    struct SwapParams {
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 amountOutMin;
        address to;
        uint256 deadline;
    }

    mapping(bytes32 => Pool) public pools;
    mapping(address => bool) public supportedTokens;
    
    bytes32[] public poolIds;
    address public constant WETH = 0x4200000000000000000000000000000000000006; // Base WETH
    
    uint256 public constant MAX_FEE = 500; // 5% max fee
    uint256 public constant BASIS_POINTS = 10000;

    event PoolCreated(
        bytes32 indexed poolId,
        address indexed tokenA,
        address indexed tokenB,
        uint256 fee
    );

    event LiquidityAdded(
        bytes32 indexed poolId,
        address indexed provider,
        uint256 amountA,
        uint256 amountB
    );

    event Swap(
        bytes32 indexed poolId,
        address indexed user,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );

    modifier validDeadline(uint256 deadline) {
        require(deadline >= block.timestamp, "SimpleSwap: EXPIRED");
        _;
    }

    modifier tokenSupported(address token) {
        require(supportedTokens[token] || token == WETH, "SimpleSwap: TOKEN_NOT_SUPPORTED");
        _;
    }

    constructor() {
        // Add WETH as supported by default
        supportedTokens[WETH] = true;
    }

    /**
     * @dev Get pool ID for a token pair
     */
    function getPoolId(address tokenA, address tokenB) public pure returns (bytes32) {
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        return keccak256(abi.encodePacked(token0, token1));
    }

    /**
     * @dev Create a new liquidity pool
     */
    function createPool(
        address tokenA,
        address tokenB,
        uint256 fee
    ) external onlyOwner tokenSupported(tokenA) tokenSupported(tokenB) {
        require(tokenA != tokenB, "SimpleSwap: IDENTICAL_ADDRESSES");
        require(fee <= MAX_FEE, "SimpleSwap: FEE_TOO_HIGH");

        bytes32 poolId = getPoolId(tokenA, tokenB);
        require(!pools[poolId].active, "SimpleSwap: POOL_EXISTS");

        pools[poolId] = Pool({
            tokenA: tokenA < tokenB ? tokenA : tokenB,
            tokenB: tokenA < tokenB ? tokenB : tokenA,
            reserveA: 0,
            reserveB: 0,
            fee: fee,
            active: true
        });

        poolIds.push(poolId);

        emit PoolCreated(poolId, tokenA, tokenB, fee);
    }

    /**
     * @dev Add token to supported list
     */
    function addSupportedToken(address token) external onlyOwner {
        supportedTokens[token] = true;
    }

    /**
     * @dev Add liquidity to a pool
     */
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountA,
        uint256 amountB
    ) external nonReentrant tokenSupported(tokenA) tokenSupported(tokenB) {
        bytes32 poolId = getPoolId(tokenA, tokenB);
        Pool storage pool = pools[poolId];
        require(pool.active, "SimpleSwap: POOL_NOT_EXISTS");

        // Transfer tokens to contract
        IERC20(tokenA).safeTransferFrom(msg.sender, address(this), amountA);
        IERC20(tokenB).safeTransferFrom(msg.sender, address(this), amountB);

        // Update reserves
        if (tokenA == pool.tokenA) {
            pool.reserveA += amountA;
            pool.reserveB += amountB;
        } else {
            pool.reserveA += amountB;
            pool.reserveB += amountA;
        }

        emit LiquidityAdded(poolId, msg.sender, amountA, amountB);
    }

    /**
     * @dev Get amount out for a given amount in
     */
    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut,
        uint256 fee
    ) public pure returns (uint256 amountOut) {
        require(amountIn > 0, "SimpleSwap: INSUFFICIENT_INPUT_AMOUNT");
        require(reserveIn > 0 && reserveOut > 0, "SimpleSwap: INSUFFICIENT_LIQUIDITY");

        uint256 amountInWithFee = amountIn * (BASIS_POINTS - fee);
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = (reserveIn * BASIS_POINTS) + amountInWithFee;
        amountOut = numerator / denominator;
    }

    /**
     * @dev Execute a token swap
     */
    function swap(SwapParams calldata params) 
        external 
        nonReentrant 
        validDeadline(params.deadline)
        tokenSupported(params.tokenIn)
        tokenSupported(params.tokenOut)
    {
        require(params.amountIn > 0, "SimpleSwap: INSUFFICIENT_INPUT_AMOUNT");
        require(params.tokenIn != params.tokenOut, "SimpleSwap: IDENTICAL_ADDRESSES");

        bytes32 poolId = getPoolId(params.tokenIn, params.tokenOut);
        Pool storage pool = pools[poolId];
        require(pool.active, "SimpleSwap: POOL_NOT_EXISTS");

        // Determine which token is A and which is B
        bool tokenInIsA = params.tokenIn == pool.tokenA;
        uint256 reserveIn = tokenInIsA ? pool.reserveA : pool.reserveB;
        uint256 reserveOut = tokenInIsA ? pool.reserveB : pool.reserveA;

        // Calculate output amount
        uint256 amountOut = getAmountOut(params.amountIn, reserveIn, reserveOut, pool.fee);
        require(amountOut >= params.amountOutMin, "SimpleSwap: INSUFFICIENT_OUTPUT_AMOUNT");

        // Update reserves
        if (tokenInIsA) {
            pool.reserveA += params.amountIn;
            pool.reserveB -= amountOut;
        } else {
            pool.reserveB += params.amountIn;
            pool.reserveA -= amountOut;
        }

        // Execute transfers
        IERC20(params.tokenIn).safeTransferFrom(msg.sender, address(this), params.amountIn);
        IERC20(params.tokenOut).safeTransfer(params.to, amountOut);

        emit Swap(poolId, msg.sender, params.tokenIn, params.tokenOut, params.amountIn, amountOut);
    }

    /**
     * @dev Get pool information
     */
    function getPool(address tokenA, address tokenB) 
        external 
        view 
        returns (Pool memory) 
    {
        bytes32 poolId = getPoolId(tokenA, tokenB);
        return pools[poolId];
    }

    /**
     * @dev Get all pool IDs
     */
    function getAllPools() external view returns (bytes32[] memory) {
        return poolIds;
    }

    /**
     * @dev Get quote for swap
     */
    function getQuote(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external view returns (uint256 amountOut) {
        bytes32 poolId = getPoolId(tokenIn, tokenOut);
        Pool memory pool = pools[poolId];
        require(pool.active, "SimpleSwap: POOL_NOT_EXISTS");

        bool tokenInIsA = tokenIn == pool.tokenA;
        uint256 reserveIn = tokenInIsA ? pool.reserveA : pool.reserveB;
        uint256 reserveOut = tokenInIsA ? pool.reserveB : pool.reserveA;

        return getAmountOut(amountIn, reserveIn, reserveOut, pool.fee);
    }

    /**
     * @dev Emergency withdraw for owner
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
    }
}
