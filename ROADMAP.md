
Artifact Virtual — Technical Roadmap
====================================

Purpose
-------
{{ purpose }}

How to use this file
--------------------
{{ usage_instructions }}

Legend
------
{{ legend }}

Roadmap (Detailed)
------------------

1) Developer environment (must-have, top priority)
      - [{{ dev_env_containerized_status }}] Containerized reproducible dev environment
         - Files: {{ dev_env_containerized_files }}
         - Commands: {{ dev_env_containerized_commands }}
         - Success: {{ dev_env_containerized_success }}
         - Tests: {{ dev_env_containerized_tests }}

      - [{{ dev_env_local_status }}] Local fallback (if not using Docker): clean system steps
         - Commands: {{ dev_env_local_commands }}
         - Success: {{ dev_env_local_success }}

2) Wallet & Onboarding (frontend)
      - [{{ wallet_provider_status }}] Add wagmi + viem provider wrapper
         - Files: {{ wallet_provider_files }}
         - Env: {{ wallet_provider_env }}
      - [{{ wallet_context_status }}] Keep existing `WalletContext` fallback; progressively migrate
         - Files: {{ wallet_context_files }}
         - Must: {{ wallet_context_must }}
      - [{{ wallet_full_migration_status }}] Full migration: replace injected raw usage with wagmi hooks across app
         - Tasks: {{ wallet_full_migration_tasks }}
         - Success: {{ wallet_full_migration_success }}
         - Tests: {{ wallet_full_migration_tests }}

3) Onchain profile publishing (IPFS + Pinata)
      - [{{ ipfs_upload_helper_status }}] Upload helper implemented
         - Files: {{ ipfs_upload_helper_files }}
         - Env: {{ ipfs_upload_helper_env }}
         - Success: {{ ipfs_upload_helper_success }}
      - [{{ ipfs_harden_upload_status }}] Harden upload: retry logic, progress UI, CID validation
         - Edge cases: {{ ipfs_harden_upload_edge_cases }}
         - Tests: {{ ipfs_harden_upload_tests }}

4) Smart contracts — ProfileRegistry & infra
      - [{{ contracts_draft_status }}] Draft `contracts/ProfileRegistryV2.sol` with AccessControl + ERC2771Context
         - Files: {{ contracts_draft_files }}
         - Note: {{ contracts_draft_note }}
      - [{{ contracts_cleanup_status }}] Clean up Solidity deps
         - Tasks: {{ contracts_cleanup_tasks }}
      - [{{ contracts_opengsn_status }}] OpenGSN & ERC-2771 support
         - Tasks: {{ contracts_opengsn_tasks }}
         - Success: {{ contracts_opengsn_success }}

5) RBAC, admin UI
      - [{{ admin_ui_status }}] Admin UI for role assignment and audit
         - Files: {{ admin_ui_files }}
         - Features: {{ admin_ui_features }}
         - Tests: {{ admin_ui_tests }}

6) Multi-chain + ENS support
      - [{{ multichain_plan_status }}] Multi-chain registry plan
         - Design: {{ multichain_plan_design }}
         - Files: {{ multichain_plan_files }}
      - [{{ ens_integration_status }}] ENS integration
         - Tasks: {{ ens_integration_tasks }}

7) Gas estimation, CI, & deployment
      - [{{ gas_fetcher_status }}] Gas fetcher script added
         - Files: {{ gas_fetcher_files }}
      - [{{ ci_workflow_status }}] CI workflow added (compile + estimate)
         - Files: {{ ci_workflow_files }}
      - [{{ deploy_scripts_status }}] Deploy scripts & base deployment
         - Files: {{ deploy_scripts_files }}
         - Tasks: {{ deploy_scripts_tasks }}
         - Tests: {{ deploy_scripts_tests }}

8) Relayer & OpenGSN
      - [{{ relayer_setup_status }}] Relayer setup & testnet deployment
         - Tasks: {{ relayer_setup_tasks }}
         - Tests: {{ relayer_setup_tests }}

9) Security, tests, audits
      - [{{ unit_tests_status }}] Unit tests: Hardhat + Waffle/Foundry
         - Files: {{ unit_tests_files }}
         - Tests: {{ unit_tests_tests }}
      - [{{ integration_tests_status }}] Integration tests: frontend -> contracts (using local node or Hardhat in Docker)
      - [{{ static_analysis_status }}] Static analysis & audit checklist: Slither, MythX, manual review

10) Cleanups & consolidation
      - [{{ remove_shims_status }}] Remove temporary OpenZeppelin shims and ensure `@openzeppelin/contracts` used
      - [{{ consolidation_status }}] Decide on single-package consolidation or keep `contracts` separate
         - Recommendation: {{ consolidation_recommendation }}

11) Docs, onboarding, release
      - [{{ docs_readme_status }}] README.dev.md and README.contracts.md (commands, environment variables)
      - [{{ docs_changelog_status }}] CHANGELOG and release checklist (deploy, verify, publish frontend assets)

Environment variables (examples)
--------------------------------
{{ env_vars }}

Quality gates (before merge)
----------------------------
{{ quality_gates }}

How the assistant will keep state & refresh without losing track
----------------------------------------------------------------
{{ assistant_state_refresh }}

Immediate next actions (now)
----------------------------
{{ immediate_next_actions }}


