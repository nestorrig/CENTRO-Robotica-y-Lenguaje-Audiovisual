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
        className={`fixed top-16 right-5 z-40 w-[min(20rem,calc(100vw-2.5rem))] border border-paper/20 bg-paper p-5 text-ink shadow-[0_12px_40px_rgba(38,0,0,0.18)] backdrop-blur-sm transition-all duration-300 sm:right-7 ${
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <h2 className="font-didot-headline text-lg font-semibold tracking-tight">
          Sobre esta bitácora
        </h2>
        <p className="mt-3 text-sm leading-6 text-ink/70">
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
            className="underline decoration-primary-1 underline-offset-4 hover:decoration-primary-2"
            href="https://github.com/nestorrig/CENTRO-Robotica-y-Lenguaje-Audiovisual"
            target="_blank"
          >
            repositorio de este blog.
          </a>{" "}
          Sin más, espero que el contenido de este blog te sea de ayuda.
        </p>
        <p className="mt-3 text-sm leading-6 text-ink/70">
          Nestor Rios Garcia @nestorrig
        </p>
        <p className="mt-6 text-[0.7rem] tracking-[0.16em] text-ink/40 uppercase">
          CENTRO · Tercer semestre
        </p>
      </aside>
    </>
  );
}
