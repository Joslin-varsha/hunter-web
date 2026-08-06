export default function TopBar() {
  const items = Array(8).fill(
    "DUE TO HIGH VOLUME DURING CHRISTMAS, THE SHIPPING WILL BE DELAYED FOR 3 DAYS"
  );

  return (
    <div className="bg-[#111111] text-white py-2 sm:py-3 overflow-hidden">
      <div className="animate-marquee flex items-center gap-16 whitespace-nowrap text-[11px] sm:text-xs font-semibold tracking-[2px] uppercase">
        {items.map((text, index) => (
          <span key={index} className="flex items-center gap-16">
            <span>{text}</span>
            <span className="text-gray-500">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}