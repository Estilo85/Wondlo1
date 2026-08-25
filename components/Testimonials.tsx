'use client';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [];

export default function Testimonials() {
  return (
    <section className="w-full max-w-[1440px] mx-auto mb-8">
      {/* Soft Lavender (#EDE7FB) Background Container */}
      <div className="w-full bg-[#EDE7FB] rounded-3xl p-8 sm:p-12 relative">
        
        {/* Section Title */}
        <div className="text-center mb-8">
          <h2 className="font-poppins font-bold text-xl sm:text-2xl text-[#2B2740]">
            What our users say
          </h2>
          <p className="font-inter text-xs text-[#7E6BB3] mt-1">
            Hear directly from other travellers from across the globe.
          </p>
        </div>

        {/* Content Container */}
        {testimonials.length > 0 ? (
          <div className="flex items-center gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              {testimonials.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 border border-[#F6F4FE]"
                >
                  <div className="space-y-1">
                    <span className="font-serif text-3xl leading-none text-[#C7B5F5] block">“</span>
                    <p className="font-inter text-[11px] text-[#2B2740]/80 leading-relaxed min-h-[52px]">
                      {item.quote}
                    </p>
                  </div>

                  <div className="flex items-end justify-between pt-3 border-t border-[#F6F4FE]">
                    <div className="flex items-center space-x-2.5">
                      <img 
                        src={item.avatar} 
                        alt={item.name} 
                        className="w-8 h-8 rounded-full object-cover border border-[#EDE7FB]" 
                      />
                      <div>
                        <h4 className="font-poppins font-bold text-[11px] text-[#2B2740] leading-tight">
                          {item.name}
                        </h4>
                        <p className="font-inter text-[9px] text-[#7E6BB3]">
                          {item.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-0.5 text-[#FFC107]">
                      {[...Array(item.rating)].map((_, i) => (
                        <span key={i} className="text-xs">★</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              type="button" 
              aria-label="Next testimonials" 
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#7E6BB3] shadow-xs border border-white/60 transition shrink-0"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </button>
          </div>
        ) : (
          /* Empty State placeholder matching brand style */
          <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-8 border border-dashed border-[#C7B5F5] text-center max-w-lg mx-auto space-y-2">
            <p className="font-poppins font-semibold text-xs text-[#2B2740]">
              No reviews submitted yet
            </p>
            <p className="font-inter text-[11px] text-[#7E6BB3]">
              Be the first traveler to share your adventure safety experiences with our community!
            </p>
          </div>
        )}

      </div>
    </section>
  );
}