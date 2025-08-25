"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronDown, Search } from "lucide-react"

export default function FitnessApp() {
  const [activeTab, setActiveTab] = useState("home")
  const [profileConfig, setProfileConfig] = useState("main")
  const [activeWorkout, setActiveWorkout] = useState(null)
  const [workoutTime, setWorkoutTime] = useState(0)
  const [isWorkoutPaused, setIsWorkoutPaused] = useState(false)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [expandedHistoryItem, setExpandedHistoryItem] = useState(null)
  const [historyFilter, setHistoryFilter] = useState("all")
  const [historySearch, setHistorySearch] = useState("")
  const [workoutData, setWorkoutData] = useState({ reps: 0, sets: 0, distance: 0, calories: 0 })

  const [userProfile, setUserProfile] = useState({
    name: "João Silva",
    email: "joao.silva@email.com",
    age: 28,
    weight: 75,
    height: 1.78,
    bio: "Apaixonado por fitness e vida saudável",
  })
  const [goals, setGoals] = useState({
    dailySteps: 15000,
    weeklyWorkouts: 6,
    dailyCalories: 2000,
    weeklyDistance: 50,
    targetWeight: 72,
  })
  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    mealReminders: true,
    progressUpdates: true,
    socialUpdates: false,
    emailNotifications: true,
  })
  const [privacy, setPrivacy] = useState({
    profileVisibility: "friends",
    shareWorkouts: true,
    shareProgress: false,
    allowMessages: true,
    dataSharing: false,
  })

  useEffect(() => {
    let interval = null
    if (!isWorkoutPaused && activeWorkout) {
      interval = setInterval(() => {
        setWorkoutTime((time) => time + 1)
        // Simular queima de calorias
        setWorkoutData((prev) => ({
          ...prev,
          calories: prev.calories + 0.1,
        }))
      }, 1000)
    } else if (isWorkoutPaused) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isWorkoutPaused, activeWorkout])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startWorkout = (type) => {
    setActiveWorkout(type)
    setWorkoutTime(0)
    setCurrentExerciseIndex(0)
    setIsWorkoutPaused(false)
    setWorkoutData({ reps: 0, sets: 0, distance: 0, calories: 0 })
  }

  const finishWorkout = () => {
    setActiveWorkout(null)
    setIsWorkoutPaused(true)
    setWorkoutTime(0)
    setCurrentExerciseIndex(0)
    setWorkoutData({ reps: 0, sets: 0, distance: 0, calories: 0 })
  }

  const workoutExercises = {
    running: [
      { name: "Aquecimento", duration: 300, description: "Caminhada leve" },
      { name: "Corrida Moderada", duration: 1200, description: "Ritmo confortável" },
      { name: "Intervalos", duration: 600, description: "30s rápido, 30s lento" },
      { name: "Desaquecimento", duration: 300, description: "Caminhada leve" },
    ],
    strength: [
      { name: "Flexões", reps: 15, sets: 3, description: "Peito e tríceps" },
      { name: "Agachamentos", reps: 20, sets: 3, description: "Pernas e glúteos" },
      { name: "Prancha", duration: 60, sets: 3, description: "Core e estabilidade" },
      { name: "Burpees", reps: 10, sets: 3, description: "Corpo inteiro" },
    ],
    yoga: [
      { name: "Saudação ao Sol", duration: 300, description: "Aquecimento" },
      { name: "Guerreiro I", duration: 180, description: "Força e equilíbrio" },
      { name: "Cachorro Olhando para Baixo", duration: 120, description: "Alongamento" },
      { name: "Relaxamento", duration: 300, description: "Meditação final" },
    ],
    cycling: [
      { name: "Aquecimento", duration: 300, description: "Pedalada leve" },
      { name: "Resistência", duration: 900, description: "Ritmo constante" },
      { name: "Subidas", duration: 600, description: "Alta resistência" },
      { name: "Recuperação", duration: 300, description: "Pedalada leve" },
    ],
  }

  const renderContent = () => {
    if (activeWorkout) {
      const exercises = workoutExercises[activeWorkout] || []
      const currentEx = exercises[currentExerciseIndex] || {}

      return (
        <section className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={finishWorkout} className="hover:bg-primary/10 transition-colors">
              ← Sair do Treino
            </Button>
            <h2 className="text-3xl font-bold font-serif text-foreground capitalize">
              {activeWorkout === "running"
                ? "Corrida"
                : activeWorkout === "strength"
                  ? "Musculação"
                  : activeWorkout === "yoga"
                    ? "Yoga"
                    : "Ciclismo"}
            </h2>
          </div>

          {/* Timer Principal */}
          <Card className="mb-6 glass-card border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-8 text-center">
              <div className="text-6xl font-bold text-primary mb-4">{formatTime(workoutTime)}</div>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => setIsWorkoutPaused(!isWorkoutPaused)}
                  className={isWorkoutPaused ? "bg-orange-500 hover:bg-orange-600" : "premium-gradient"}
                >
                  {isWorkoutPaused ? "▶️ Continuar" : "⏸️ Pausar"}
                </Button>
                <Button
                  variant="outline"
                  onClick={finishWorkout}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                >
                  🏁 Finalizar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Exercício Atual */}
          <Card className="mb-6 glass-card border-0 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  Exercício {currentExerciseIndex + 1} de {exercises.length}
                </span>
                <span className="text-sm text-muted-foreground">{formatTime(0)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-2xl font-bold mb-2">{currentEx.name}</h3>
              <p className="text-muted-foreground mb-4">{currentEx.description}</p>

              {currentEx.duration && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Duração</span>
                    <span>
                      {Math.floor(currentEx.duration / 60)}:{(currentEx.duration % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                  <Progress value={(0 / currentEx.duration) * 100} className="h-3" />
                </div>
              )}

              {currentEx.reps && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">{currentEx.reps}</div>
                    <p className="text-sm text-muted-foreground">Repetições</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-secondary">{currentEx.sets}</div>
                    <p className="text-sm text-muted-foreground">Séries</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {currentExerciseIndex > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentExerciseIndex(currentExerciseIndex - 1)
                    }}
                    className="flex-1"
                  >
                    ← Anterior
                  </Button>
                )}
                {currentExerciseIndex < exercises.length - 1 && (
                  <Button
                    onClick={() => {
                      setCurrentExerciseIndex(currentExerciseIndex + 1)
                    }}
                    className="flex-1 premium-gradient"
                  >
                    Próximo →
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas do Treino */}
          <Card className="glass-card border-0 bg-gradient-to-br from-card to-card/30">
            <CardHeader>
              <CardTitle>Estatísticas do Treino</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-primary/10">
                  <div className="text-2xl font-bold text-primary">{Math.round(0)}</div>
                  <p className="text-sm text-muted-foreground">Calorias</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/10">
                  <div className="text-2xl font-bold text-secondary">{currentExerciseIndex + 1}</div>
                  <p className="text-sm text-muted-foreground">Exercícios</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )
    }

    switch (activeTab) {
      case "home":
        return (
          <>
            <section className="relative mb-12 overflow-hidden rounded-3xl premium-gradient p-8 text-white">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative z-10">
                <h2 className="text-4xl font-bold font-serif mb-3">Bem-vindo de volta!</h2>
                <p className="text-white/90 text-lg mb-6">Vamos superar seus limites hoje</p>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-2xl">🔥</span>
                  </div>
                  <div>
                    <p className="text-sm text-white/80">Sequência atual</p>
                    <p className="text-2xl font-bold">7 dias</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card border-0 bg-gradient-to-br from-primary/10 to-secondary/10 hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-2xl">🎯</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground">Seu Compromisso</h3>
                        <p className="text-sm text-muted-foreground">Meta de 90 dias</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-primary">23 dias</span>
                        <span className="text-sm text-muted-foreground">restantes</span>
                      </div>
                      <Progress value={74} className="h-3" />
                      <p className="text-sm text-center text-muted-foreground">
                        Você já completou <span className="font-semibold text-primary">67 dias</span> da sua jornada!
                      </p>
                      <div className="bg-primary/5 rounded-lg p-3 mt-4">
                        <p className="text-sm font-medium text-primary text-center">
                          💪 "Cada dia é uma vitória. Continue firme!"
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-0 bg-gradient-to-br from-secondary/10 to-chart-3/10 hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center">
                        <span className="text-2xl">⚖️</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground">Meta de Peso</h3>
                        <p className="text-sm text-muted-foreground">Objetivo: 75kg</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-secondary">3.2 kg</span>
                        <span className="text-sm text-muted-foreground">para a meta</span>
                      </div>
                      <Progress value={78} className="h-3" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Atual: 78.2kg</span>
                        <span>Meta: 75kg</span>
                      </div>
                      <div className="bg-secondary/5 rounded-lg p-3 mt-4">
                        <p className="text-sm font-medium text-secondary text-center">
                          🎉 "Você já perdeu 8.8kg! Está quase lá!"
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-card border-0 bg-gradient-to-r from-chart-3/10 to-chart-4/10 hover-lift mt-6">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="font-bold text-xl text-foreground mb-2">Motivação do Dia</h3>
                    <p className="text-lg text-muted-foreground mb-4">
                      "O sucesso é a soma de pequenos esforços repetidos dia após dia."
                    </p>
                    <div className="flex justify-center gap-8 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-lg text-chart-3">87%</div>
                        <div className="text-muted-foreground">Progresso geral</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg text-chart-4">12</div>
                        <div className="text-muted-foreground">Recordes batidos</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg text-primary">156</div>
                        <div className="text-muted-foreground">Treinos completos</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="hover-lift glass-card border-0 bg-gradient-to-br from-card to-card/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Passos Hoje</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xl">👟</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">12,547</div>
                  <p className="text-xs text-muted-foreground mb-3">+18% desde ontem</p>
                  <Progress value={84} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">Meta: 15,000 passos</p>
                </CardContent>
              </Card>

              <Card className="hover-lift glass-card border-0 bg-gradient-to-br from-card to-card/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Calorias Queimadas</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <span className="text-xl">🔥</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-secondary mb-2">1,847</div>
                  <p className="text-xs text-muted-foreground mb-3">+24% desde ontem</p>
                  <Progress value={92} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">Meta: 2,000 kcal</p>
                </CardContent>
              </Card>

              <Card className="hover-lift glass-card border-0 bg-gradient-to-br from-card to-card/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Tempo Ativo</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-chart-3/10 flex items-center justify-center">
                    <span className="text-xl">⏱️</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-chart-3 mb-2">3h 42m</div>
                  <p className="text-xs text-muted-foreground mb-3">+1h 15m desde ontem</p>
                  <Progress value={78} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">Meta: 4h 30m</p>
                </CardContent>
              </Card>
            </section>

            <section className="mb-12">
              <h3 className="text-2xl font-bold font-serif text-foreground mb-6">Iniciar Treino</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  className="h-24 flex-col gap-3 premium-gradient hover:scale-105 transition-transform pulse-glow"
                  onClick={() => startWorkout("running")}
                >
                  <span className="text-3xl">🏃‍♂️</span>
                  <span className="font-semibold">Corrida</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-3 border-2 border-secondary text-secondary hover:bg-secondary hover:text-white hover:scale-105 transition-all bg-transparent"
                  onClick={() => startWorkout("strength")}
                >
                  <span className="text-3xl">💪</span>
                  <span className="font-semibold">Musculação</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-3 border-2 border-chart-3 text-chart-3 hover:bg-chart-3 hover:text-white hover:scale-105 transition-all bg-transparent"
                  onClick={() => startWorkout("yoga")}
                >
                  <span className="text-3xl">🧘‍♀️</span>
                  <span className="font-semibold">Yoga</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-3 border-2 border-chart-4 text-chart-4 hover:bg-chart-4 hover:text-white hover:scale-105 transition-all bg-transparent"
                  onClick={() => startWorkout("cycling")}
                >
                  <span className="text-3xl">🚴‍♂️</span>
                  <span className="font-semibold">Ciclismo</span>
                </Button>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold font-serif text-foreground mb-6">Atividades Recentes</h3>
              <Card className="glass-card border-0 bg-gradient-to-br from-card to-card/30">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-6 p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 hover-lift">
                      <div className="h-14 w-14 rounded-full premium-gradient flex items-center justify-center">
                        <span className="text-white text-xl">🏃‍♂️</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-lg text-foreground">Corrida Matinal Intensa</p>
                        <p className="text-muted-foreground">8.4 km • 42 min • 520 kcal</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            Novo recorde!
                          </span>
                          <span className="text-xs text-muted-foreground">Ritmo: 5:00/km</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">Hoje</div>
                        <div className="text-xs text-muted-foreground">07:15</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 p-4 rounded-2xl bg-gradient-to-r from-secondary/5 to-chart-3/5 hover-lift">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-secondary to-chart-3 flex items-center justify-center">
                        <span className="text-white text-xl">💪</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-lg text-foreground">Treino de Força - Superiores</p>
                        <p className="text-muted-foreground">55 min • 12 exercícios • 380 kcal</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                            Completo
                          </span>
                          <span className="text-xs text-muted-foreground">Volume: 2,840 kg</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">Ontem</div>
                        <div className="text-xs text-muted-foreground">18:30</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 p-4 rounded-2xl bg-gradient-to-r from-chart-3/5 to-chart-4/5 hover-lift">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-chart-3 to-chart-4 flex items-center justify-center">
                        <span className="text-white text-xl">🧘‍♀️</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-lg text-foreground">Sessão de Yoga Relaxante</p>
                        <p className="text-muted-foreground">35 min • Hatha Yoga • 120 kcal</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs bg-chart-3/10 text-chart-3 px-2 py-1 rounded-full">Mindfulness</span>
                          <span className="text-xs text-muted-foreground">Frequência cardíaca: 85 bpm</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">2 dias atrás</div>
                        <div className="text-xs text-muted-foreground">19:45</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </>
        )

      case "activity":
        return (
          <section>
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setActiveTab("home")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Voltar</span>
              </button>
              <h2 className="text-3xl font-bold font-serif text-foreground">Atividades</h2>
              <div></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="glass-card border-0 bg-gradient-to-br from-primary/5 to-secondary/5 hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl font-serif">
                    <div className="h-10 w-10 rounded-full premium-gradient flex items-center justify-center">
                      <span className="text-white">🏃‍♂️</span>
                    </div>
                    Distância Semanal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary mb-3">42.8 km</div>
                  <p className="text-muted-foreground mb-4">Meta: 50 km (+14% vs semana passada)</p>
                  <Progress value={86} className="h-3 mb-4" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Faltam 7.2 km</span>
                    <span>86% completo</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-0 bg-gradient-to-br from-secondary/5 to-chart-3/5 hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl font-serif">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-secondary to-chart-3 flex items-center justify-center">
                      <span className="text-white">💪</span>
                    </div>
                    Treinos Completados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-secondary mb-3">5/6</div>
                  <p className="text-muted-foreground mb-4">Excelente consistência esta semana!</p>
                  <Progress value={83} className="h-3 mb-4" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>1 treino restante</span>
                    <span>83% completo</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-card border-0 bg-gradient-to-br from-card to-card/30">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Histórico Detalhado</CardTitle>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Buscar atividades..."
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <select
                    value={historyFilter}
                    onChange={(e) => setHistoryFilter(e.target.value)}
                    className="px-4 py-2 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="all">Todas</option>
                    <option value="corrida">Corrida</option>
                    <option value="musculacao">Musculação</option>
                    <option value="natacao">Natação</option>
                    <option value="ciclismo">Ciclismo</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      id: 1,
                      activity: "Corrida Intervalada",
                      type: "corrida",
                      duration: "52 min",
                      calories: "680 kcal",
                      date: "Hoje",
                      time: "07:15",
                      details: "10x400m • Ritmo: 4:45/km",
                      color: "primary",
                      distance: "8.5 km",
                      avgHeartRate: "165 bpm",
                      maxHeartRate: "185 bpm",
                      splits: ["4:42", "4:38", "4:51", "4:40", "4:45"],
                    },
                    {
                      id: 2,
                      activity: "Treino Funcional",
                      type: "musculacao",
                      duration: "45 min",
                      calories: "420 kcal",
                      date: "Ontem",
                      time: "18:30",
                      details: "HIIT • 8 exercícios • 4 rounds",
                      color: "secondary",
                      exercises: ["Burpees", "Mountain Climbers", "Jump Squats", "Push-ups"],
                      sets: 4,
                      avgHeartRate: "145 bpm",
                    },
                    {
                      id: 3,
                      activity: "Natação",
                      type: "natacao",
                      duration: "60 min",
                      calories: "580 kcal",
                      date: "2 dias atrás",
                      time: "06:00",
                      details: "2000m • Crawl e costas",
                      color: "chart-3",
                      distance: "2.0 km",
                      strokes: ["Crawl: 1200m", "Costas: 800m"],
                      avgPace: "1:30/100m",
                    },
                    {
                      id: 4,
                      activity: "Ciclismo",
                      type: "ciclismo",
                      duration: "90 min",
                      calories: "750 kcal",
                      date: "3 dias atrás",
                      time: "16:00",
                      details: "35 km • Velocidade média: 23 km/h",
                      color: "chart-4",
                      distance: "35 km",
                      maxSpeed: "42 km/h",
                      elevation: "450 m",
                    },
                  ]
                    .filter((item) => {
                      const matchesFilter = historyFilter === "all" || item.type === historyFilter
                      const matchesSearch = item.activity.toLowerCase().includes(historySearch.toLowerCase())
                      return matchesFilter && matchesSearch
                    })
                    .map((item) => (
                      <div key={item.id} className="border border-border/50 rounded-2xl overflow-hidden">
                        <div
                          className="flex items-center gap-6 p-5 rounded-2xl bg-gradient-to-r from-muted/30 to-transparent hover-lift cursor-pointer"
                          onClick={() => setExpandedHistoryItem(expandedHistoryItem === item.id ? null : item.id)}
                        >
                          <div
                            className={`h-14 w-14 rounded-full bg-${item.color}/10 flex items-center justify-center border-2 border-${item.color}/20`}
                          >
                            <span className="text-xl">
                              {item.activity.includes("Corrida")
                                ? "🏃‍♂️"
                                : item.activity.includes("Treino")
                                  ? "💪"
                                  : item.activity.includes("Natação")
                                    ? "🏊‍♂️"
                                    : "🚴‍♂️"}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-lg text-foreground">{item.activity}</p>
                            <p className="text-muted-foreground">
                              {item.duration} • {item.calories}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">{item.details}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium text-foreground">{item.date}</span>
                            <div
                              className={`text-xs bg-${item.color}/10 text-${item.color} px-2 py-1 rounded-full mt-1`}
                            >
                              Completo
                            </div>
                            <ChevronDown
                              className={`h-4 w-4 mt-2 mx-auto transition-transform ${
                                expandedHistoryItem === item.id ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </div>

                        {expandedHistoryItem === item.id && (
                          <div className="px-5 pb-5 bg-muted/20">
                            <div className="pt-4 border-t border-border/30">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="text-center p-3 rounded-xl bg-background/50">
                                  <div className="text-sm text-muted-foreground">Horário</div>
                                  <div className="font-bold text-foreground">{item.time}</div>
                                </div>
                                {item.distance && (
                                  <div className="text-center p-3 rounded-xl bg-background/50">
                                    <div className="text-sm text-muted-foreground">Distância</div>
                                    <div className="font-bold text-foreground">{item.distance}</div>
                                  </div>
                                )}
                                {item.avgHeartRate && (
                                  <div className="text-center p-3 rounded-xl bg-background/50">
                                    <div className="text-sm text-muted-foreground">FC Média</div>
                                    <div className="font-bold text-foreground">{item.avgHeartRate}</div>
                                  </div>
                                )}
                                {item.maxHeartRate && (
                                  <div className="text-center p-3 rounded-xl bg-background/50">
                                    <div className="text-sm text-muted-foreground">FC Máxima</div>
                                    <div className="font-bold text-foreground">{item.maxHeartRate}</div>
                                  </div>
                                )}
                              </div>

                              {item.splits && (
                                <div className="mb-4">
                                  <h4 className="font-semibold mb-2">Splits (por km)</h4>
                                  <div className="flex gap-2 flex-wrap">
                                    {item.splits.map((split, index) => (
                                      <span
                                        key={index}
                                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                                      >
                                        {index + 1}km: {split}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {item.exercises && (
                                <div className="mb-4">
                                  <h4 className="font-semibold mb-2">Exercícios ({item.sets} séries)</h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    {item.exercises.map((exercise, index) => (
                                      <span
                                        key={index}
                                        className="px-3 py-2 bg-secondary/10 text-secondary rounded-lg text-sm"
                                      >
                                        {exercise}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="flex gap-3 mt-4">
                                <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors">
                                  Repetir Treino
                                </button>
                                <button className="flex-1 px-4 py-2 border border-border rounded-xl hover:bg-muted/50 transition-colors">
                                  Compartilhar
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )

      case "nutrition":
        return (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("home")}
                className="hover:bg-primary/10 transition-colors"
              >
                ← Voltar
              </Button>
              <h2 className="text-2xl font-bold text-foreground">Nutrição</h2>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Resumo Diário</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">1,247</div>
                    <p className="text-sm text-muted-foreground">Calorias</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">85g</div>
                    <p className="text-sm text-muted-foreground">Proteínas</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-chart-3">2.1L</div>
                    <p className="text-sm text-muted-foreground">Água</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Macronutrientes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Carboidratos</span>
                    <span>156g / 200g</span>
                  </div>
                  <Progress value={78} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Proteínas</span>
                    <span>85g / 120g</span>
                  </div>
                  <Progress value={71} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Gorduras</span>
                    <span>45g / 60g</span>
                  </div>
                  <Progress value={75} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Refeições de Hoje</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { meal: "Café da Manhã", food: "Aveia com frutas", calories: "320 kcal" },
                    { meal: "Almoço", food: "Frango grelhado com arroz", calories: "450 kcal" },
                    { meal: "Lanche", food: "Iogurte com granola", calories: "180 kcal" },
                    { meal: "Jantar", food: "Salmão com legumes", calories: "380 kcal" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">{item.meal}</p>
                        <p className="text-sm text-muted-foreground">{item.food}</p>
                      </div>
                      <span className="text-sm font-medium">{item.calories}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )

      case "profile":
        return (
          <section>
            {profileConfig === "main" && (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("home")}
                    className="hover:bg-primary/10 transition-colors"
                  >
                    ← Voltar
                  </Button>
                  <h2 className="text-2xl font-bold text-foreground">Perfil</h2>
                </div>

                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-3xl">👤</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{userProfile.name}</h3>
                        <p className="text-muted-foreground">Atleta Iniciante</p>
                        <p className="text-sm text-muted-foreground mt-1">{userProfile.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold text-primary">{userProfile.weight}kg</div>
                        <p className="text-sm text-muted-foreground">Peso</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold text-accent">{userProfile.height}m</div>
                        <p className="text-sm text-muted-foreground">Altura</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Estatísticas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Treinos este mês</span>
                        <span className="font-bold">18</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Calorias queimadas</span>
                        <span className="font-bold">8,450 kcal</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Distância percorrida</span>
                        <span className="font-bold">124 km</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Tempo ativo</span>
                        <span className="font-bold">32h 15min</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Configurações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent hover:bg-primary/5"
                        onClick={() => setProfileConfig("edit")}
                      >
                        ✏️ Editar Perfil
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent hover:bg-secondary/5"
                        onClick={() => setProfileConfig("goals")}
                      >
                        🎯 Definir Metas
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent hover:bg-chart-3/5"
                        onClick={() => setProfileConfig("notifications")}
                      >
                        🔔 Notificações
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent hover:bg-chart-4/5"
                        onClick={() => setProfileConfig("privacy")}
                      >
                        🔒 Privacidade
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {profileConfig === "edit" && (
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Button variant="ghost" size="sm" onClick={() => setProfileConfig("main")}>
                    ← Voltar
                  </Button>
                  <CardTitle>Editar Perfil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        value={userProfile.name}
                        onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userProfile.email}
                        onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="age">Idade</Label>
                      <Input
                        id="age"
                        type="number"
                        value={userProfile.age}
                        onChange={(e) => setUserProfile({ ...userProfile, age: Number.parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">Peso (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        value={userProfile.weight}
                        onChange={(e) => setUserProfile({ ...userProfile, weight: Number.parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Altura (m)</Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.01"
                        value={userProfile.height}
                        onChange={(e) => setUserProfile({ ...userProfile, height: Number.parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Biografia</Label>
                    <Textarea
                      id="bio"
                      value={userProfile.bio}
                      onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                      placeholder="Conte um pouco sobre você..."
                    />
                  </div>
                  <Button className="w-full premium-gradient">Salvar Alterações</Button>
                </CardContent>
              </Card>
            )}

            {profileConfig === "goals" && (
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Button variant="ghost" size="sm" onClick={() => setProfileConfig("main")}>
                    ← Voltar
                  </Button>
                  <CardTitle>Definir Metas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="steps">Passos Diários</Label>
                      <Input
                        id="steps"
                        type="number"
                        value={goals.dailySteps}
                        onChange={(e) => setGoals({ ...goals, dailySteps: Number.parseInt(e.target.value) })}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Meta atual: {goals.dailySteps.toLocaleString()} passos
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="workouts">Treinos Semanais</Label>
                      <Input
                        id="workouts"
                        type="number"
                        value={goals.weeklyWorkouts}
                        onChange={(e) => setGoals({ ...goals, weeklyWorkouts: Number.parseInt(e.target.value) })}
                      />
                      <p className="text-sm text-muted-foreground mt-1">Meta atual: {goals.weeklyWorkouts} treinos</p>
                    </div>
                    <div>
                      <Label htmlFor="calories">Calorias Diárias</Label>
                      <Input
                        id="calories"
                        type="number"
                        value={goals.dailyCalories}
                        onChange={(e) => setGoals({ ...goals, dailyCalories: Number.parseInt(e.target.value) })}
                      />
                      <p className="text-sm text-muted-foreground mt-1">Meta atual: {goals.dailyCalories} kcal</p>
                    </div>
                    <div>
                      <Label htmlFor="distance">Distância Semanal (km)</Label>
                      <Input
                        id="distance"
                        type="number"
                        value={goals.weeklyDistance}
                        onChange={(e) => setGoals({ ...goals, weeklyDistance: Number.parseInt(e.target.value) })}
                      />
                      <p className="text-sm text-muted-foreground mt-1">Meta atual: {goals.weeklyDistance} km</p>
                    </div>
                    <div>
                      <Label htmlFor="targetWeight">Peso Alvo (kg)</Label>
                      <Input
                        id="targetWeight"
                        type="number"
                        step="0.1"
                        value={goals.targetWeight}
                        onChange={(e) => setGoals({ ...goals, targetWeight: Number.parseFloat(e.target.value) })}
                      />
                      <p className="text-sm text-muted-foreground mt-1">Meta atual: {goals.targetWeight} kg</p>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-secondary to-chart-3 text-white">
                    Atualizar Metas
                  </Button>
                </CardContent>
              </Card>
            )}

            {profileConfig === "notifications" && (
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Button variant="ghost" size="sm" onClick={() => setProfileConfig("main")}>
                    ← Voltar
                  </Button>
                  <CardTitle>Configurações de Notificação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">Lembretes de Treino</p>
                        <p className="text-sm text-muted-foreground">
                          Receba notificações para não perder seus treinos
                        </p>
                      </div>
                      <Switch
                        checked={notifications.workoutReminders}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, workoutReminders: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">Lembretes de Refeição</p>
                        <p className="text-sm text-muted-foreground">Notificações para manter sua alimentação em dia</p>
                      </div>
                      <Switch
                        checked={notifications.mealReminders}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, mealReminders: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">Atualizações de Progresso</p>
                        <p className="text-sm text-muted-foreground">Resumos semanais do seu desempenho</p>
                      </div>
                      <Switch
                        checked={notifications.progressUpdates}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, progressUpdates: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">Atualizações Sociais</p>
                        <p className="text-sm text-muted-foreground">Atividades de amigos e comunidade</p>
                      </div>
                      <Switch
                        checked={notifications.socialUpdates}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, socialUpdates: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">Notificações por Email</p>
                        <p className="text-sm text-muted-foreground">Receba resumos por email</p>
                      </div>
                      <Switch
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, emailNotifications: checked })
                        }
                      />
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-chart-3 to-chart-4 text-white">
                    Salvar Preferências
                  </Button>
                </CardContent>
              </Card>
            )}

            {profileConfig === "privacy" && (
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Button variant="ghost" size="sm" onClick={() => setProfileConfig("main")}>
                    ← Voltar
                  </Button>
                  <CardTitle>Configurações de Privacidade</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/30">
                      <Label htmlFor="visibility" className="font-medium">
                        Visibilidade do Perfil
                      </Label>
                      <select
                        id="visibility"
                        className="w-full mt-2 p-2 rounded border bg-background"
                        value={privacy.profileVisibility}
                        onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                      >
                        <option value="public">Público</option>
                        <option value="friends">Apenas Amigos</option>
                        <option value="private">Privado</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">Compartilhar Treinos</p>
                        <p className="text-sm text-muted-foreground">Permitir que outros vejam seus treinos</p>
                      </div>
                      <Switch
                        checked={privacy.shareWorkouts}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, shareWorkouts: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">Compartilhar Progresso</p>
                        <p className="text-sm text-muted-foreground">Mostrar estatísticas e conquistas</p>
                      </div>
                      <Switch
                        checked={privacy.shareProgress}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, shareProgress: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">Permitir Mensagens</p>
                        <p className="text-sm text-muted-foreground">Receber mensagens de outros usuários</p>
                      </div>
                      <Switch
                        checked={privacy.allowMessages}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, allowMessages: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">Compartilhamento de Dados</p>
                        <p className="text-sm text-muted-foreground">Permitir uso de dados para pesquisas</p>
                      </div>
                      <Switch
                        checked={privacy.dataSharing}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, dataSharing: checked })}
                      />
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-chart-4 to-primary text-white">
                    Atualizar Privacidade
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-serif premium-gradient bg-clip-text text-transparent">
                FitTracker Pro
              </h1>
              <p className="text-muted-foreground font-sans">Excelência em fitness</p>
            </div>
            <Button
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all hover:scale-105 bg-transparent"
              onClick={() => setActiveTab("profile")}
            >
              Meu Perfil
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">{renderContent()}</main>

      <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-white/90 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="flex justify-around py-3">
            <Button
              variant="ghost"
              className={`flex-col gap-2 h-16 transition-all hover:scale-110 ${
                activeTab === "home"
                  ? "text-primary bg-primary/10 rounded-2xl"
                  : "text-muted-foreground hover:text-primary"
              }`}
              onClick={() => setActiveTab("home")}
            >
              <span className="text-2xl">🏠</span>
              <span className="text-xs font-medium">Início</span>
            </Button>
            <Button
              variant="ghost"
              className={`flex-col gap-2 h-16 transition-all hover:scale-110 ${
                activeTab === "activity"
                  ? "text-primary bg-primary/10 rounded-2xl"
                  : "text-muted-foreground hover:text-primary"
              }`}
              onClick={() => setActiveTab("activity")}
            >
              <span className="text-2xl">📊</span>
              <span className="text-xs font-medium">Atividade</span>
            </Button>
            <Button
              variant="ghost"
              className={`flex-col gap-2 h-16 transition-all hover:scale-110 ${
                activeTab === "nutrition"
                  ? "text-primary bg-primary/10 rounded-2xl"
                  : "text-muted-foreground hover:text-primary"
              }`}
              onClick={() => setActiveTab("nutrition")}
            >
              <span className="text-2xl">🥗</span>
              <span className="text-xs font-medium">Nutrição</span>
            </Button>
            <Button
              variant="ghost"
              className={`flex-col gap-2 h-16 transition-all hover:scale-110 ${
                activeTab === "profile"
                  ? "text-primary bg-primary/10 rounded-2xl"
                  : "text-muted-foreground hover:text-primary"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              <span className="text-2xl">👤</span>
              <span className="text-xs font-medium">Perfil</span>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  )
}

