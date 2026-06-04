import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Container, Stack, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Star, Truck, ShieldCheck, Heart, Smartphone, Download } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import heroSweetsImg from '../assets/hero_sweets.png';
import heritageKitchenImg from '../assets/heritage_kitchen.png';

// --- ANIMATION OBSERVER HOOK ---
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.2, ...options });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isIntersecting];
};

const SectionWrapper = ({ children, delay = '', sx = {} }) => {
  const [ref, isVisible] = useIntersectionObserver();
  return (
    <Box ref={ref} sx={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.8s', ...sx }}>
      <Box className={isVisible ? `animate-slide-up ${delay}` : ''} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
      </Box>
    </Box>
  );
};

// --- SUBCOMPONENTS ---

const HeroSection = ({ onCtaClick, onMenuClick }) => (
  <Box sx={{ minHeight: '90vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', pt: 10, pb: 4 }}>
    <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, bgcolor: 'var(--primary)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.1, zIndex: 0 }} />
    <Box sx={{ position: 'absolute', bottom: -100, left: -100, width: 300, height: 300, bgcolor: 'var(--secondary)', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.2, zIndex: 0 }} />

    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 8 }}>

        <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
          <Box className="animate-slide-up" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 1, borderRadius: 8, bgcolor: 'rgba(249, 115, 22, 0.1)', color: 'var(--primary)', mb: 3, border: '2px solid var(--primary)' }}>
            <Star size={16} fill="var(--primary)" />
            <Typography variant="body2" fontWeight={800}>#1 Sweets in Town</Typography>
          </Box>

          <Typography className="animate-slide-up delay-100" variant="h2" fontWeight={900} sx={{ mb: 2, letterSpacing: '-2px', lineHeight: 1.1, fontSize: { xs: '3.5rem', md: '5rem' } }}>
            Taste the Magic of <br />
            <Box component="span" sx={{ color: 'var(--primary)', position: 'relative', display: 'inline-block' }}>
              QuickBite
              <Box sx={{ position: 'absolute', bottom: 8, left: 0, width: '100%', height: 12, bgcolor: 'var(--secondary)', zIndex: -1, transform: 'rotate(-2deg)' }} />
            </Box>
          </Typography>

          <Typography className="animate-slide-up delay-200" variant="h6" color="text.secondary" sx={{ mb: 5, maxWidth: 500, mx: { xs: 'auto', md: 0 }, lineHeight: 1.6 }}>
            Authentic Indian sweets and desserts delivered fresh to your doorstep in minutes. Experience happiness in every box.
          </Typography>

          <Stack className="animate-slide-up delay-300" direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }}>
            <Button variant="contained" size="large" endIcon={<ArrowRight />} onClick={onCtaClick} sx={{ px: 4, py: 2, fontSize: '1.2rem', borderRadius: 2 }}>
              Order Now
            </Button>
            <Button variant="outlined" size="large" startIcon={<ShoppingBag />} onClick={onMenuClick} sx={{ px: 4, py: 2, fontSize: '1.2rem', borderRadius: 2, bgcolor: 'white', color: 'black' }}>
              View Menu
            </Button>
          </Stack>
        </Box>

        <Box sx={{ flex: 1, position: 'relative', height: { xs: 300, md: 500 }, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box className="animate-slide-up delay-400" sx={{ position: 'relative', zIndex: 2, width: { xs: 260, md: 400 }, height: { xs: 260, md: 400 }, borderRadius: '50%', bgcolor: '#FFEDD5', border: '6px solid black', overflow: 'hidden', boxShadow: '12px 12px 0px 0px rgba(0,0,0,1)' }}>
            <img src={heroSweetsImg} alt="Mithai Box" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
          <Box className="animate-float" sx={{ position: 'absolute', top: '5%', left: '0%', zIndex: 3, width: 80, height: 80, borderRadius: 2, bgcolor: 'white', border: '2px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}><Typography variant="h4">🍩</Typography></Box>
          <Box className="animate-float" sx={{ position: 'absolute', bottom: '15%', right: '0%', zIndex: 3, width: 100, height: 100, borderRadius: '50%', bgcolor: 'var(--secondary)', border: '2px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)', animationDelay: '1s' }}><Typography variant="h3">🍮</Typography></Box>
        </Box>

      </Box>
    </Container>
  </Box>
);

const FeatureCard = ({ icon, title, desc, bgColor }) => (
  <Paper sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderRadius: 4, bgcolor: bgColor || 'white', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)', border: '2px solid black', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' } }}>
    <Box sx={{ p: 2, borderRadius: '50%', bgcolor: 'black', color: 'white', mb: 3, border: '2px solid black' }}>
      {icon}
    </Box>
    <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>{title}</Typography>
    <Typography variant="body1" color="text.secondary">{desc}</Typography>
  </Paper>
);

const FeaturesSection = () => (
  <Box sx={{ py: 10, bgcolor: 'var(--background)' }}>
    <Container maxWidth="lg">
      <SectionWrapper>
        <Typography variant="h3" fontWeight={900} textAlign="center" sx={{ mb: 6 }}>Why Choose QuickBite?</Typography>
      </SectionWrapper>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', gap: 4 }}>
        <Box sx={{ flex: '1 1 calc(33.333% - 32px)', minWidth: 280, display: 'flex', flexDirection: 'column' }}>
          <SectionWrapper delay="delay-100" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <FeatureCard icon={<Heart size={32} />} title="Authentic Taste" desc="Made with pure desi ghee and traditional recipes passed down through generations." bgColor="#ffe4e6" />
          </SectionWrapper>
        </Box>
        <Box sx={{ flex: '1 1 calc(33.333% - 32px)', minWidth: 280, display: 'flex', flexDirection: 'column' }}>
          <SectionWrapper delay="delay-200" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <FeatureCard icon={<Truck size={32} />} title="Fast Delivery" desc="We deliver within a 15km radius to ensure your sweets arrive fresh and delicious." bgColor="#e0e7ff" />
          </SectionWrapper>
        </Box>
        <Box sx={{ flex: '1 1 calc(33.333% - 32px)', minWidth: 280, display: 'flex', flexDirection: 'column' }}>
          <SectionWrapper delay="delay-300" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <FeatureCard icon={<ShieldCheck size={32} />} title="Premium Quality" desc="100% hygiene guaranteed. We source only the highest quality ingredients." bgColor="#dcfce7" />
          </SectionWrapper>
        </Box>
      </Box>
    </Container>
  </Box>
);

const AboutSection = () => (
  <Box sx={{ py: 12, bgcolor: 'white', borderTop: '2px solid black', borderBottom: '2px solid black' }}>
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', md: 'row' }, alignItems: 'center', gap: 8 }}>
        <Box sx={{ flex: 1, width: '100%' }}>
          <SectionWrapper>
            <Paper sx={{ p: 1, borderRadius: 4, bgcolor: 'var(--primary)', boxShadow: '12px 12px 0px 0px rgba(0,0,0,1)', border: '2px solid black' }}>
              <Box sx={{ borderRadius: 3, overflow: 'hidden', border: '2px solid black', height: 450 }}>
                <img src={heritageKitchenImg} alt="Our Kitchen" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            </Paper>
          </SectionWrapper>
        </Box>
        <Box sx={{ flex: 1 }}>
          <SectionWrapper delay="delay-100">
            <Typography variant="h3" fontWeight={900} sx={{ mb: 3 }}>The Heritage of Taste</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.8 }}>
              For over three decades, QuickBite has been synonymous with celebration and joy. What started as a small family kitchen has grown into the city's most beloved sweet shop.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.8 }}>
              Every laddoo, every piece of barfi is handcrafted by our master halwais using pure ghee, fresh milk, and a whole lot of love. When you bite into our sweets, you're tasting history.
            </Typography>
            <Button variant="contained" size="large" sx={{ px: 4, py: 1.5, borderRadius: 2 }}>
              Learn Our Story
            </Button>
          </SectionWrapper>
        </Box>
      </Box>
    </Container>
  </Box>
);

const AppPromoSection = () => (
  <Box sx={{ py: 12, bgcolor: 'var(--background)' }}>
    <Container maxWidth="lg">
      <Paper sx={{
        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        color: 'white',
        borderRadius: 8,
        p: { xs: 4, md: 8 },
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '12px 12px 0px 0px rgba(0,0,0,1)',
        border: '4px solid black'
      }}>
        <Box sx={{ position: 'absolute', top: '-20%', right: '-5%', width: 500, height: 500, bgcolor: 'white', opacity: 0.1, borderRadius: '50%' }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 6, position: 'relative', zIndex: 1 }}>
          <Box sx={{ flex: 1 }}>
            <SectionWrapper>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Smartphone size={32} />
                <Typography variant="h6" fontWeight={800}>GET THE APP</Typography>
              </Box>
              <Typography variant="h3" fontWeight={900} sx={{ mb: 3, lineHeight: 1.2 }}>
                Order Faster With The QuickBite Mobile App
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem', opacity: 0.9 }}>
                Experience lightning-fast ordering, live delivery tracking on the map, and exclusive in-app discounts. We deliver within a strict 15km radius to ensure your food is always fresh.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" size="large" startIcon={<Download />} sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: '#333' }, px: 4, py: 2, borderRadius: 2 }}>
                  Download App
                </Button>
              </Stack>
            </SectionWrapper>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <SectionWrapper delay="delay-200">
              <Box sx={{ width: 260, height: 520, bgcolor: 'black', borderRadius: '40px', border: '8px solid black', p: 1, position: 'relative', boxShadow: '4px 4px 0px 0px rgba(255,255,255,0.3)' }}>
                <Box sx={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 80, height: 24, bgcolor: 'black', borderRadius: '0 0 12px 12px', zIndex: 2 }} />
                <Box sx={{ width: '100%', height: '100%', bgcolor: 'white', borderRadius: '32px', overflow: 'hidden' }}>
                  {/* Mock App Screen */}
                  <Box sx={{ height: 60, bgcolor: '#f97316', display: 'flex', alignItems: 'center', px: 2, color: 'white', borderBottom: '2px solid black' }}>
                    <Typography fontWeight={900}>QuickBite</Typography>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Box sx={{ width: '100%', height: 120, bgcolor: '#ffedd5', borderRadius: 2, mb: 2, border: '2px solid #f97316' }}></Box>
                    <Box sx={{ width: '80%', height: 20, bgcolor: '#e5e7eb', borderRadius: 1, mb: 1 }}></Box>
                    <Box sx={{ width: '60%', height: 20, bgcolor: '#e5e7eb', borderRadius: 1, mb: 3 }}></Box>
                    <Box sx={{ width: '100%', height: 80, bgcolor: '#f9fafb', borderRadius: 2, mb: 2, border: '1px solid #e5e7eb' }}></Box>
                    <Box sx={{ width: '100%', height: 80, bgcolor: '#f9fafb', borderRadius: 2, border: '1px solid #e5e7eb' }}></Box>
                  </Box>
                </Box>
              </Box>
            </SectionWrapper>
          </Box>
        </Box>
      </Paper>
    </Container>
  </Box>
);

const CtaSection = ({ onCtaClick }) => (
  <Box sx={{ py: 12, textAlign: 'center', bgcolor: 'var(--secondary)', borderTop: '2px solid black' }}>
    <Container maxWidth="md">
      <SectionWrapper>
        <Typography variant="h2" fontWeight={900} sx={{ mb: 4, letterSpacing: '-1px' }}>
          Ready for a Sweet Treat?
        </Typography>
        <Typography variant="h6" sx={{ mb: 5, opacity: 0.8 }}>
          Join thousands of happy customers who trust QuickBite for their daily dose of happiness.
        </Typography>
        <Button variant="contained" size="large" endIcon={<ArrowRight />} onClick={onCtaClick} sx={{ px: 6, py: 2.5, fontSize: '1.3rem', borderRadius: 2, bgcolor: 'black', color: 'white', '&:hover': { bgcolor: '#333' } }}>
          Start Your Order
        </Button>
      </SectionWrapper>
    </Container>
  </Box>
);

// --- MAIN PAGE ---

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleCtaClick = () => {
    if (user) {
      navigate('/menu');
    } else {
      navigate('/login');
    }
  };

  const handleMenuClick = () => navigate('/menu');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <HeroSection onCtaClick={handleCtaClick} onMenuClick={handleMenuClick} />
      <FeaturesSection />
      <AboutSection />
      <AppPromoSection />
      <CtaSection onCtaClick={handleCtaClick} />
    </Box>
  );
};

export default LandingPage;
