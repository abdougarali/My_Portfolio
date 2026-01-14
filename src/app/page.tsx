"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Code, Palette, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Code,
    title: "Full-Stack Development",
    description: "Building modern web applications with React, Next.js, Node.js, and more.",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Creating beautiful, responsive designs that provide exceptional user experiences.",
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description: "Optimizing applications for speed, scalability, and user satisfaction.",
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Hi, I'm{" "}
              <span className="gradient-text">Garali Abdesslem</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
              A passionate full-stack developer creating digital experiences that matter. 
              I build modern web applications with clean code and beautiful design.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 px-4 sm:px-0">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/projects">
                  View My Work
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
                <Link href="/contact">Get In Touch</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl">
              What I Do
            </h2>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-muted-foreground px-4 sm:px-0">
              I specialize in creating modern, scalable web applications that deliver 
              exceptional user experiences and business value.
            </p>
          </motion.div>
        </div>
        <div className="mx-auto mt-10 sm:mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2 sm:pb-4">
                    <feature.icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-2" />
                    <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm sm:text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl px-4 sm:px-0">
            Let's Build Something Amazing Together
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-muted-foreground px-4 sm:px-0">
            Ready to bring your ideas to life? I'd love to hear about your project 
            and discuss how we can work together.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 px-4 sm:px-0">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/contact">
                Start a Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
              <Link href="/about">Learn More About Me</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
