# Bitácora · Robótica y Lenguaje Audiovisual

![Robótica y Lenguaje Audiovisual](public/img/cover.png)

Bitácora del curso **Robótica y Lenguaje Audiovisual** en [CENTRO | Diseño, Cine y Televisión](https://centro.edu.mx/), en tercer semestre de la carrera de Computación Creativa. No es una registro cerrado ni un sitio institucional: es una bitácora personal que documenta lo que se ve en clase, el proceso de los proyectos terminales y las reflexiones que van quedando entre una sesión y la siguiente.

## Propósito

Cada entrada corresponde a una sesión. Ahí conviven teoría, referencias, ejercicios y notas propias. La redacción no siempre es lineal (se intenta lo mas posible): importa más dejar constancia del pensamiento en el momento que forzar un ensayo pulido.

El archivo se actualiza de manera recurrente a lo largo del semestre. Irán apareciendo sesiones nuevas, correcciones y capas sobre lo ya publicado.

Nestor Rios Garcia ([@nestorrig](https://github.com/nestorrig))

## Cómo poder aportar

Si detectas un error de narración, una fuente mal citada o un dato impreciso, abre un [issue](https://github.com/nestorrig/CENTRO-Robotica-y-Lenguaje-Audiovisual/issues) o un [pull request](https://github.com/nestorrig/CENTRO-Robotica-y-Lenguaje-Audiovisual/pulls) en el repositorio. Las entradas están en [`content/entradas/`](content/entradas): un archivo `.mdx` por sesión. Se agradece corregir con precisión y respetar el tono de cada entrada: no hace falta reescribir el texto, solo dejarlo más claro o más cierto.

## Cómo está hecha

Sitio web con una escena 3D de fondo y las entradas escritas en Markdown. El contenido vive aparte de la interfaz, para poder sumar o editar sesiones sin reconstruir el resto.

### Stack

- Next.js
- Tailwind CSS
- TypeScript
- Three.js
- React Three Fiber
- React Three Drei
- MDX

### Instalación

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).
