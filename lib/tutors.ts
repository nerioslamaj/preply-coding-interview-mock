export type Tutor = {
  id: string;
  name: string;
  languages: string;
};

export const tutors: Tutor[] = [
  { id: "tutor_a", name: "Ana Ruiz", languages: "English and Spanish" },
  { id: "tutor_b", name: "Marco Bianchi", languages: "Italian" },
];

export function findTutor(id: string): Tutor {
  return (
    tutors.find((tutor) => tutor.id === id) ?? {
      id,
      name: id,
      languages: "Language lessons",
    }
  );
}
