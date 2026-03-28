import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQPage = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqData = t("faq.items", { returnObjects: true }) as FAQItem[];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
            <HelpCircle size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            {t("faq.title")}
          </h1>
          <p className="text-indigo-100 text-lg">
            {t("faq.subtitle")}
          </p>
        </div>
      </div>

      {/* FAQ List */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-3">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer group">
                <span className="font-bold text-slate-900 dark:text-white pr-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-slate-400 shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180 text-indigo-600" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}>
                <div className="px-6 pb-5 text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-50 dark:border-slate-700 pt-4">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-3xl p-8 text-center border border-indigo-100 dark:border-indigo-800">
          <MessageCircle size={32} className="text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {t("faq.ctaTitle")}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            {t("faq.ctaText")}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50">
            <MessageCircle size={18} />
            {t("faq.ctaButton")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
