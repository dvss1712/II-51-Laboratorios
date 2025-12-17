-- Crear tabla de profesores
CREATE TABLE IF NOT EXISTS profesores (
    id TEXT PRIMARY KEY,
    nombre_completo TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    departamento TEXT NOT NULL
);

-- Crear tabla de estudiantes
CREATE TABLE IF NOT EXISTS estudiantes (
    id TEXT PRIMARY KEY,
    nombre_completo TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    carrera TEXT NOT NULL
);

-- Crear tabla de cursos
CREATE TABLE IF NOT EXISTS cursos (
    id TEXT PRIMARY KEY,
    profesor_asignado TEXT,
    nombre TEXT NOT NULL,
    creditos INTEGER NOT NULL,
    FOREIGN KEY (profesor_asignado) REFERENCES profesores(id)
);

-- Deshabilitar RLS para desarrollo (habilita si necesitas autenticación)
ALTER TABLE profesores DISABLE ROW LEVEL SECURITY;
ALTER TABLE estudiantes DISABLE ROW LEVEL SECURITY;
ALTER TABLE cursos DISABLE ROW LEVEL SECURITY;