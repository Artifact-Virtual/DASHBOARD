const TestIndex = () => {
  return (
    <div className="bg-red-500 text-white p-8 text-2xl">
      <h1>TEST PAGE - If you see this, React is working!</h1>
      <p>Time: {new Date().toLocaleString()}</p>
      <p>Tailwind classes should make this red background</p>
    </div>
  );
};

export default TestIndex;
