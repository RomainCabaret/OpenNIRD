"use server";

import LevelOne from "@/components/pages/lvl1/LevelOne";
import LevelTwo from "@/components/pages/lvl2/LevelTwo";
import LevelThree from "@/components/pages/lvl3/LevelThree";
import LevelFour from "@/components/pages/lvl4/LevelFour";
import LevelFive from "@/components/pages/lvl5/LevelFive";
import { redirect } from "next/navigation";

export default async function LessonPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = await params;

  const idNumber = parseInt(id, 10);

  if (isNaN(idNumber)) {
    return redirect("/");
  }

  switch (idNumber) {
    case 1:
      return <LevelOne />;
    case 2:
      return <LevelTwo />;
    case 3:
      return <LevelThree />;
    case 4:
      return <LevelFour />;
    case 5:
      return <LevelFive />;
    default:
      return redirect("/");
  }
}
