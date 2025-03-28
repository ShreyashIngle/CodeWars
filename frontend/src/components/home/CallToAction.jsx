


import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import image5 from "../../images/image5.jpg";
import image6 from "../../images/image6.jpg";
import image7 from "../../images/image7.jpg";
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../utils/translations';

function CallToAction() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { language } = useLanguage();
  const t = translations[language].callToAction;

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl font-bold text-center mb-16"
        >
          {t.heading}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: t.cropYieldPrediction, image: image5 },
            { title: t.cropHealthMonitoring, image: image6 },
            { title: t.sustainabilityInsights, image: image7 },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="group relative overflow-hidden rounded-xl"
            >
              <div className="aspect-w-16 aspect-h-9 relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/70 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center px-6 py-3 bg-blue-500 text-black rounded-full font-semibold hover:bg-blue-400 transition-colors"
                    >
                      {t.learnMore}
                      <ArrowRight className="ml-2" size={20} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CallToAction;
