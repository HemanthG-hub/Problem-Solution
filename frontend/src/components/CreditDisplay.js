const CreditDisplay = ({ credits }) => {
  return (
    <div className="text-center">
      <p className="text-sm text-gray-600">Credits</p>
      <p className="text-3xl font-bold text-green-600">{credits}</p>
    </div>
  );
};

export default CreditDisplay;