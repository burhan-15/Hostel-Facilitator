import { useState, useEffect } from "react";
import { getFAQs } from "../services/faqService";

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFAQs = async () => {
      try {
        const data = await getFAQs();
        setFaqs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load FAQs", err);
      } finally {
        setLoading(false);
      }
    };

    loadFAQs();
  }, []);

  if (loading) return <FAQSkeleton />;

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        Frequently Asked Questions
      </h1>

      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.length === 0 ? (
          <p className="text-gray-400 text-center">No FAQs available.</p>
        ) : (
          faqs.map((faq, index) => (
            <div
              key={faq._id}
              className="bg-gray-800 border border-gray-700 rounded-lg"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center p-4 text-left text-white font-semibold hover:bg-gray-700 rounded-lg"
              >
                {faq.question}

                {/* Arrow Icon */}
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Answer dropdown */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-40 p-4" : "max-h-0 px-4"
                }`}
              >
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function FAQSkeleton() {
  const placeholderItems = Array.from({ length: 5 }); // number of FAQ cards to show

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Title Skeleton */}
        <div className="h-12 w-2/3 bg-gray-700 rounded mx-auto animate-pulse"></div>

        {/* FAQ Cards Skeleton */}
        {placeholderItems.map((_, index) => (
          <div
            key={index}
            className="bg-gray-800 border border-gray-700 rounded-lg animate-pulse"
          >
            {/* Question Skeleton */}
            <div className="h-6 w-5/6 bg-gray-600 rounded m-4"></div>

            {/* Answer Skeleton */}
            <div className="h-4 w-full bg-gray-700 rounded mb-2 mx-4"></div>
            <div className="h-4 w-5/6 bg-gray-700 rounded mb-4 mx-4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}