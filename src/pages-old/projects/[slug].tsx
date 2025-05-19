import { GetStaticProps, GetStaticPaths } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Project } from '@/types/project';
import ProjectTemplate from '@/components/projects/ProjectTemplate';

interface ProjectPageProps {
  project: Project;
  projects: Project[];
}

export default function ProjectPage({ project, projects }: ProjectPageProps) {
  return <ProjectTemplate project={project} projects={projects} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const projectsDirectory = path.join(process.cwd(), 'src/content/projects');
  const filenames = fs.readdirSync(projectsDirectory);

  const paths = filenames
    .filter((filename) => {
      // Exclude example file and lets-not-dry-out-the-future
      const slug = filename.replace(/\.md$/, '');
      return filename.endsWith('.md') && 
             filename !== 'example-bilingual-project.md' &&
             slug !== 'lets-not-dry-out-the-future';
    })
    .map((filename) => ({
      params: {
        slug: filename.replace(/\.md$/, ''),
      },
    }));

  return {
    paths,
    fallback: false, // Return 404 for non-existent pages
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string };
  
  // Read all projects to pass to the template for related projects
  const projectsDirectory = path.join(process.cwd(), 'src/content/projects');
  const filenames = fs.readdirSync(projectsDirectory);
  
  const allProjects = filenames
    .filter((filename) => {
      const slug = filename.replace(/\.md$/, '');
      return filename.endsWith('.md') && 
             filename !== 'example-bilingual-project.md' &&
             slug !== 'lets-not-dry-out-the-future';
    })
    .map((filename) => {
      const filePath = path.join(projectsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        ...data,
        slug: filename.replace(/\.md$/, ''),
        content,
      } as Project;
    });
  
  // Find the current project
  const projectFile = allProjects.find((p) => p.slug === slug);
  
  if (!projectFile) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      project: projectFile,
      projects: allProjects,
    },
  };
};
