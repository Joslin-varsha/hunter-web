import { FaStar } from "react-icons/fa";

const reviews = [
  {
    id: 1,
    name: "Sophia",
    review:
      "Amazing quality! The hoodie fits perfectly and the fabric feels premium. Definitely ordering again.",
  },
  {
    id: 2,
    name: "James",
    review:
      "Fast delivery and excellent customer service. The streetwear collection looks even better in person.",
  },
  {
    id: 3,
    name: "Olivia",
    review:
      "One of the best online fashion stores I've tried. Stylish, comfortable, and worth every penny.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <p className="uppercase tracking-[5px] text-orange-500 font-semibold">
            Reviews
          </p>

          <h2 className="text-5xl font-bold mt-3">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-3xl p-8 shadow hover:shadow-xl transition"
            >

              <div className="flex text-yellow-400 mb-5">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>

              <p className="text-gray-600 leading-8">
                "{review.review}"
              </p>

              <h3 className="mt-8 font-bold text-xl">
                {review.name}
              </h3>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}