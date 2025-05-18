"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#FFF5E6] text-[#4A4A4A] p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto">
        {/* Game Title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 text-[#8B7355] retro-text">
            Village of Secrets
          </h1>
          <p className="text-xl text-[#6B5B4E]">
            A game of mystery and deception
          </p>
        </div>

        {/* Character Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Villager Card */}
          <div className="bg-white p-6 rounded-lg border-2 border-[#D4C4B7] hover:scale-105 transition-transform shadow-md">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-[#F5E6D3] rounded-full flex items-center justify-center">
                <span className="text-4xl">👨‍🌾</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#8B7355]">
                Villager
              </h3>
              <p className="text-sm text-[#6B5B4E]">
                The innocent townsfolk trying to survive
              </p>
            </div>
          </div>

          {/* Wolf Card */}
          <div className="bg-white p-6 rounded-lg border-2 border-[#D4C4B7] hover:scale-105 transition-transform shadow-md">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-[#F5E6D3] rounded-full flex items-center justify-center">
                <span className="text-4xl">🐺</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#8B7355]">Wolf</h3>
              <p className="text-sm text-[#6B5B4E]">
                The cunning predator in disguise
              </p>
            </div>
          </div>

          {/* Detective Card */}
          <div className="bg-white p-6 rounded-lg border-2 border-[#D4C4B7] hover:scale-105 transition-transform shadow-md">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-[#F5E6D3] rounded-full flex items-center justify-center">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#8B7355]">
                Detective
              </h3>
              <p className="text-sm text-[#6B5B4E]">
                The sharp-eyed investigator
              </p>
            </div>
          </div>

          {/* Doctor Card */}
          <div className="bg-white p-6 rounded-lg border-2 border-[#D4C4B7] hover:scale-105 transition-transform shadow-md">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-[#F5E6D3] rounded-full flex items-center justify-center">
                <span className="text-4xl">👨‍⚕️</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#8B7355]">Doctor</h3>
              <p className="text-sm text-[#6B5B4E]">
                The village healer and protector
              </p>
            </div>
          </div>
        </div>

        {/* Game Description */}
        <div className="bg-white p-8 rounded-lg mb-12 border-2 border-[#D4C4B7] shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center text-[#8B7355]">
            Welcome to the Village
          </h2>
          <p className="text-[#6B5B4E] text-center">
            In this mysterious village, danger lurks in the shadows. Wolves hide
            among the villagers, while the detective and doctor work to protect
            the innocent. Can you survive the night?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              router.push("/lobby");
            }}
            className="bg-[#8B7355] hover:bg-[#6B5B4E] text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md"
          >
            Start Game
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-white hover:bg-[#F5E6D3] text-[#8B7355] font-bold py-3 px-8 rounded-lg border-2 border-[#D4C4B7] transition-colors shadow-md"
          >
            How to Play
          </button>
        </div>
      </main>

      {/* Retro-style Footer */}
      <footer className="mt-12 text-center text-[#6B5B4E]">
        <p>© 2024 Village of Secrets - A game of mystery and deception</p>
      </footer>

      {/* How to Play Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#FFF5E6] rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-[#D4C4B7] shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-[#8B7355]">How to Play</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#6B5B4E] hover:text-[#8B7355] text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="text-xl font-bold text-[#8B7355] mb-3">
                  Game Overview
                </h3>
                <p className="text-[#6B5B4E]">
                  Village of Secrets is a social deduction game where players
                  take on different roles in a village. Each night, the wolves
                  hunt while the villagers sleep. During the day, everyone must
                  work together to identify and eliminate the wolves before they
                  take over the village.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#8B7355] mb-3">
                  Roles & Abilities
                </h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-[#D4C4B7]">
                    <h4 className="font-bold text-[#8B7355]">👨‍🌾 Villager</h4>
                    <ul className="list-disc list-inside text-[#6B5B4E] mt-2">
                      <li>Regular townsfolk with no special abilities</li>
                      <li>
                        Must use deduction and discussion to identify wolves
                      </li>
                      <li>
                        Can vote during the day to eliminate suspicious players
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-[#D4C4B7]">
                    <h4 className="font-bold text-[#8B7355]">🐺 Wolf</h4>
                    <ul className="list-disc list-inside text-[#6B5B4E] mt-2">
                      <li>Works with other wolves to eliminate villagers</li>
                      <li>Can communicate secretly with other wolves</li>
                      <li>Must blend in and avoid suspicion</li>
                      <li>Wins when wolves equal or outnumber villagers</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-[#D4C4B7]">
                    <h4 className="font-bold text-[#8B7355]">🔍 Detective</h4>
                    <ul className="list-disc list-inside text-[#6B5B4E] mt-2">
                      <li>Can investigate one player each night</li>
                      <li>
                        Learns if the investigated player is a wolf or not
                      </li>
                      <li>Must use information wisely to guide the village</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-[#D4C4B7]">
                    <h4 className="font-bold text-[#8B7355]">👨‍⚕️ Doctor</h4>
                    <ul className="list-disc list-inside text-[#6B5B4E] mt-2">
                      <li>Can protect one player each night</li>
                      <li>Protected players cannot be eliminated by wolves</li>
                      <li>
                        Cannot protect the same player two nights in a row
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#8B7355] mb-3">
                  Game Phases
                </h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-[#D4C4B7]">
                    <h4 className="font-bold text-[#8B7355]">Night Phase</h4>
                    <ul className="list-disc list-inside text-[#6B5B4E] mt-2">
                      <li>All players close their eyes</li>
                      <li>Wolves choose one player to eliminate</li>
                      <li>Detective investigates one player</li>
                      <li>Doctor protects one player</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-[#D4C4B7]">
                    <h4 className="font-bold text-[#8B7355]">Day Phase</h4>
                    <ul className="list-disc list-inside text-[#6B5B4E] mt-2">
                      <li>Results of the night are revealed</li>
                      <li>Players discuss and share information</li>
                      <li>Vote to eliminate one suspicious player</li>
                      <li>Majority vote determines who is eliminated</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#8B7355] mb-3">
                  Winning Conditions
                </h3>
                <div className="bg-white p-4 rounded-lg border border-[#D4C4B7]">
                  <ul className="list-disc list-inside text-[#6B5B4E]">
                    <li>Villagers win when all wolves are eliminated</li>
                    <li>
                      Wolves win when they equal or outnumber the remaining
                      villagers
                    </li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
