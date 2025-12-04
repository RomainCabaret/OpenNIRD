"use server";

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

  //const parcours = await getParcours(idNumber);

  //   if (!parcours) {
  //     return redirect("/learn");
  //   }

  return <>{id}</>;
}
