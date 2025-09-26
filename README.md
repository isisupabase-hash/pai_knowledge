# PAI Knowledge Base

Repositorio de conocimiento del proyecto **PAI**.  
Aquí documentamos y centralizamos información en formato **MDX**, la cual se utiliza como fuente para generar **embeddings** y alimentar el apartado **Vector** en Supabase.

---

## 📂 Estructura del repositorio

```
pai-knowledge-base/
│
├── knowledge/          # Documentos en formato MDX
│   ├── introduccion.mdx
│   ├── arquitectura.mdx
│   ├── vector.mdx
│   └── chatbot.mdx
│
├── supabase/           # Configuración de Supabase
│   └── config.json
│
├── .github/workflows/  # Automatización con GitHub Actions
│   └── supabase-vector.yml
│
└── README.md
```

---

## ⚡ Flujo de trabajo

1. Editar o agregar documentos en la carpeta `knowledge/` (formato `.mdx`).
2. Al hacer **push** en la rama `main`, se ejecuta el **GitHub Action**.
3. El Action procesa los archivos `.mdx`, genera embeddings y los inserta en la tabla `documents` de Supabase.
4. Los datos quedan listos para ser consultados desde los proyectos **Angular** y **React**.

---

## 🔧 Configuración necesaria

### Variables de entorno (en GitHub Secrets)
Debes configurar en el repositorio los siguientes secrets:

- `SUPABASE_URL` → URL de tu proyecto Supabase.  
- `SUPABASE_SERVICE_ROLE_KEY` → Clave service_role de Supabase.  
- `OPENAI_API_KEY` → Clave de la API de OpenAI.  

### Tabla en Supabase
Ejecutar en tu base de datos:

```sql
create table documents (
  id bigserial primary key,
  content text,
  embedding vector(1536)
);
```

---

## 🔍 Consultas híbridas

Ejemplo de búsqueda semántica:

```sql
select id, content
from documents
order by embedding <#> (select embedding('tu consulta'))
limit 5;
```

Ejemplo de búsqueda por keyword:

```sql
select id, content
from documents
where content ilike '%palabra%'
limit 5;
```

Ambas consultas pueden combinarse en el cliente para obtener resultados híbridos.

---

## 🚀 Próximos pasos

- [ ] Conectar Angular y React al endpoint de búsqueda.  
- [ ] Crear componente de resultados estilo buscador.  
- [ ] Implementar ChatBot en Angular con el conocimiento de `documents`.  
