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
        <h2 className="text-lg font-semibold tracking-tight">
          Sobre esta bitácora
        </h2>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          Esta bitacora es registro de lo aprendido en la clase Robótica y
          Lenguaje Audiovisual en CENTRO, esta concendra gran parte del
          contenido teorico de la clase y el proceso de los proyectos terminales
          de la clase, con anotaciones y reflexiones propias. Aunque esta
          bitacora busca tener una estructura lo mas organizada posible, es por
          eso que hay una entrada por sesion, la redaccion de cada entrada podra
          o no tener una redaccion lineal. Siempre se buscara redactar con
          fuentes y datos correctos, si llegas a detectar algun error de
          narracion o fuente siente con libertar de levantar un PR en el{" "}
          <a
            className="underline"
            href="https://github.com/nestorrig/CENTRO-Robotica-y-Lenguaje-Audiovisual"
            target="_blank"
          >
            repositorio de este blog.
          </a>{" "}
          Sin mas, espero que el contenido de este blog te sea de ayuda
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
