"use client";

export function InfoPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Cerrar panel"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-transparent"
        />
      ) : null}
      <aside
        className={`fixed top-16 right-5 z-40 w-[min(20rem,calc(100vw-2.5rem))] border border-neutral-300 bg-white/95 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-all duration-300 sm:right-7 ${
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <h2 className="font-didot-headline text-lg font-semibold tracking-tight">
          Sobre esta bitácora
        </h2>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          Esta bitácora es registro de lo aprendido en la clase Robótica y
          Lenguaje Audiovisual en CENTRO, esta contendrá gran parte del
          contenido teórico de la clase y el proceso de los proyectos terminales
          de la clase, con anotaciones y reflexiones propias. Aunque esta
          bitácora busca tener una estructura lo más organizada posible, es por
          eso que hay una entrada por sesión, la redacción de cada entrada podrá
          o no tener una redacción lineal. Siempre se buscará redactar con
          fuentes y datos correctos, si llegas a detectar algún error de
          narración o fuente siéntete con libertad de levantar un PR en el{" "}
          <a
            className="underline"
            href="https://github.com/nestorrig/CENTRO-Robotica-y-Lenguaje-Audiovisual"
            target="_blank"
          >
            repositorio de este blog.
          </a>{" "}
          Sin más, espero que el contenido de este blog te sea de ayuda.
        </p>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          Nestor Rios Garcia @nestorrig
        </p>
        <p className="mt-6 text-[0.7rem] tracking-[0.16em] text-neutral-400 uppercase">
          CENTRO · Tercer semestre
        </p>
      </aside>
    </>
  );
}
