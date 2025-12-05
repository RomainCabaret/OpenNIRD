import { useUser } from "@/context/UserContext";
import { Level } from "@/types/types";
import { Lock, Play, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function MobileStoreInterface({ levels }: { levels: Level[] }) {
  const { isLevelUnlocked, isLevelCompleted } = useUser();

  const router = useRouter();

  return (
    <div className="h-full w-full min-w-0 overflow-y-auto p-4 md:p-8">
      <header className="mb-8 flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#00E5FF] mb-1">
            Mon Voyage
          </h1>
          <p className="text-slate-400">{"Prêt à plonger dans l'aventure ?"}</p>
        </div>
        <div className="bg-[#0B1221] border border-white/10 p-3 rounded-xl flex items-center gap-3 w-fit">
          <div className="bg-amber-500/20 p-2 rounded-full">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-bold uppercase">
              Total
            </span>
            <span className="text-xl font-black font-mono text-white">
              {levels.reduce((acc, lvl) => acc + lvl.collected, 0)}
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 pb-20">
        {levels.map((level, index) => {
          const progress = isLevelCompleted(level.id) ? 100 : 0;

          const isUnlocked = isLevelUnlocked(index + 1);
          const isLocked = !isUnlocked;

          return (
            <div
              key={level.id}
              className={`group relative overflow-hidden rounded-2xl border-2 transition-all ${
                isLocked
                  ? "border-white/5 bg-white/5 grayscale"
                  : "border-[#00E5FF]/30 bg-[#0B1221] hover:border-[#00E5FF]"
              }`}
            >
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src={level.image || "/placeholder.svg"}
                  alt={level.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1221] via-transparent to-transparent" />
                <h3 className="absolute bottom-3 left-4 text-xl font-black text-white">
                  {level.name}
                </h3>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-bold mb-1 text-slate-400">
                    <span>Progression</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#00E5FF] to-[#0099FF]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!isLocked) {
                      router.push(`/niveau/${level.id}`);
                    }
                  }}
                  className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${
                    isLocked
                      ? "bg-white/5 text-slate-500 cursor-not-allowed"
                      : "bg-[#00E5FF] text-[#0B1221] hover:bg-[#6FF7FF]"
                  }`}
                  disabled={isLocked}
                >
                  {isLocked ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 fill-current" />
                  )}
                  {isLocked ? "Verrouillé" : "Explorer"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
