import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, 
  Satellite, 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3,
  ArrowRight,
  CheckCircle,
  MapPin,
  Thermometer,
  Droplets
} from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Satellite className="h-6 w-6" />,
      title: "Spectral Analysis",
      description: "Advanced hyperspectral imaging for crop health monitoring and early disease detection."
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Predictive Analytics",
      description: "AI-powered insights for yield forecasting and optimal harvest timing."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Risk Assessment",
      description: "Real-time pest and disease risk monitoring with automated alert systems."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Smart Irrigation",
      description: "Precision water management based on soil moisture and weather data."
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Data Fusion",
      description: "Combine satellite imagery with IoT sensor data for comprehensive insights."
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Field Mapping",
      description: "Interactive maps with layer toggles for NDVI, soil conditions, and more."
    }
  ];

  const stats = [
    { value: "25%", label: "Yield Increase" },
    { value: "40%", label: "Water Savings" },
    { value: "60%", label: "Early Detection" },
    { value: "99.9%", label: "Uptime" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight">AgriSense</h1>
                <p className="text-xs text-muted-foreground">Precision Agriculture</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              {!isLoading && (
                <Button
                  onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                  className="gap-2"
                >
                  {isAuthenticated ? "Dashboard" : "Get Started"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" className="mb-6">
                AI-Powered Agriculture Platform
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
                Precision Agriculture
                <span className="text-primary block">Redefined</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Harness the power of hyperspectral imaging, IoT sensors, and machine learning 
                to optimize crop yields, reduce resource waste, and make data-driven farming decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="gap-2"
                  onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                >
                  {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Watch Demo
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative lg:justify-self-end w-full"
            >
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 max-w-md ml-auto">
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-card p-4 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <Thermometer className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">Temperature</span>
                      </div>
                      <div className="text-2xl font-bold">24.5°C</div>
                      <div className="text-xs text-muted-foreground">Optimal range</div>
                    </div>
                    <div className="bg-card p-4 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Soil Moisture</span>
                      </div>
                      <div className="text-2xl font-bold">68%</div>
                      <div className="text-xs text-muted-foreground">Good levels</div>
                    </div>
                  </div>
                  <div className="bg-card p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">NDVI Health Index</span>
                      <Badge variant="secondary" className="text-green-600">Healthy</Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">0.78 - Excellent vegetation health</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 -mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-card border rounded-xl p-6 shadow-sm"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              Advanced Agricultural Intelligence
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with agricultural expertise 
              to deliver actionable insights for modern farming.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-6">
              Ready to Transform Your Farm?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of farmers who are already using AgriSense to increase yields, 
              reduce costs, and make smarter farming decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="gap-2"
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started Today"}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Schedule Demo
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Free 30-day trial
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                No setup fees
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Cancel anytime
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold">AgriSense</h3>
                <p className="text-sm text-muted-foreground">Precision Agriculture Platform</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 AgriSense. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}