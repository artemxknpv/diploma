import { Board } from "@prisma/client";
import { BoardTitleForm } from "./board-title-form";
import { BoardOptions } from "./board-options";

type BoardNavbarProps = {
  board: Board;
};

export async function BoardNavbar({ board }: BoardNavbarProps) {
  return (
    <div className="w-full h-14 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4 text-white">
      <BoardTitleForm board={board} />
      <div className="ml-auto">
        <BoardOptions board={board} />
      </div>
    </div>
  );
}
