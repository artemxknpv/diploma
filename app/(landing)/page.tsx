import { Medal } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = () => {
  return (
    <div className="flex items-center justify-center flex-col gap-y-4">
      <div className="flex items-center justify-center flex-col">
        <div
          className="mb-6 flex items-center border shadow-sm p-2 bg-amber-100 text-sm
        text-amber-700 rounded-full uppercase gap-x-2"
        >
          <Medal />
          Лучший инструмент для ведения проектов в маленьких компаниях
        </div>
        <h1 className="text-3xl md:text-5xl text-center text-neutral-800 mb-6">
          Task помогает работать над проектами и документами
        </h1>
        <div
          className="text-3xl md:text-6xl bg-gradient-to-r from-fuchsia-600
         to-pink-600 text-white px-4 p-2 rounded-md pb-4 w-fit"
        >
          быстро и интуитивно
        </div>
      </div>
      <div className="text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto">
        Не тратьте время на изучение сложных внутренних систем и переключение
        между сервисами для работы с задачами и документами — всё уже здесь
      </div>
      <Button>
        <Link href="/sign-up">Попробовать бесплатно</Link>
      </Button>
    </div>
  );
};

export default Page;
