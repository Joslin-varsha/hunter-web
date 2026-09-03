import { FaStar, FaUser } from "react-icons/fa";

const reviews = [
  {
    id: 1,
    name: "Nishanth",
    review:
      "One of the best Hub for Men's Clothing... .Great collection of shirts, tees, hoodies, pants, accessories and perfumes are available at nominal price... The best quality products... Trendy and Innovative Collections... Definitely you won't deny it's quality... Just loved it... World wide shipping service is available... Delivery at any place... Overall 5/5",
    rating: 5,
  },
  {
    id: 2,
    name: "Jaaser Shahul",
    review:
      "Hunter Mens Clothing wear is located near Vivekanandapuram,Kanyakumari. Its Started morethan 4 years ago.They have the best Zero degree perfume also. They have the Great collection of shirts, tees, hoodies, pants, accessories and perfumes are available at nominal price. The best quality deny its quality.",
    rating: 5,
  },
  {
    id: 3,
    name: "Josephin Gabril Vibun",
    review:
      "Situated near the Vivekananda puram junction. Nice shop for men clothing. Dresses are in good quality and reasonable price. Shipping over all over India. Nice place for shopping. Not only dress, but caps, shoes, watches, deodorants are also available. Designs are ultimate. Enjoy shopping,Now shipping over world. ...",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-10 sm:py-16">
      {/* Section Header */}
      <div className="mb-6 sm:mb-10">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-black tracking-tight uppercase">
          What Our Clients Say
        </h2>
      </div>

      {/* 3-Column Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
        {reviews.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all duration-300"
          >
            <div>
              {/* Header: User Avatar & Name */}
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gray-100 text-black flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-200">
                  <FaUser className="w-5 h-5 text-gray-800" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-black tracking-tight">
                  {item.name}
                </h3>
              </div>

              {/* Review Quote */}
              <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed font-normal">
                "{item.review}"
              </p>
            </div>

            {/* 5-Star Rating */}
            <div className="flex items-center gap-1 text-amber-400 text-sm mt-5 pt-3 border-t border-gray-50">
              {Array.from({ length: item.rating }).map((_, i) => (
                <FaStar key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}