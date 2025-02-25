import { useDrag } from 'react-dnd';

export interface TemplateSection {
  type: 'text' | 'image';
  content: string;
  layout: {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface Template {
  id: string;
  name: string;
  sections: TemplateSection[];
}

const templates: Template[] = [
  {
    id: 'covid-template',
    name: 'COVID-19 Template',
    sections: [
      {
        type: 'image',
        content: 'https://placehold.co/1440x950',
        layout: {
          i: 'covid-hero',
          x: 0,
          y: 0,
          w: 12,
          h: 12
        }
      },
      {
        type: 'text',
        content: '# COVID 19\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Commodo, viverra donec eget bibendum porttitor felis nulla pellentesque nunc. A aliquet urna mus purus elit diam consectetur.',
        layout: {
          i: 'covid-text',
          x: 0,
          y: 12,
          w: 6,
          h: 6
        }
      },
      {
        type: 'image',
        content: 'https://placehold.co/600x944',
        layout: {
          i: 'covid-side-image',
          x: 6,
          y: 12,
          w: 6,
          h: 12
        }
      }
    ]
  },
  {
    id: 'topic-template',
    name: 'Topic Template',
    sections: [
      {
        type: 'image',
        content: 'https://placehold.co/600x944',
        layout: {
          i: 'topic-image',
          x: 0,
          y: 0,
          w: 6,
          h: 12
        }
      },
      {
        type: 'text',
        content: '# ANOTHER INTERESTING TOPIC HERE\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Commodo, viverra donec eget bibendum porttitor felis nulla pellentesque nunc.',
        layout: {
          i: 'topic-text',
          x: 6,
          y: 0,
          w: 6,
          h: 6
        }
      }
    ]
  }
];

export const Templates = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">Templates</h2>
      {templates.map((template) => (
        <TemplateDraggable key={template.id} template={template} />
      ))}
    </div>
  );
};

const TemplateDraggable = ({ template }: { template: Template }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'template',
    item: { ...template, type: 'template' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-4 border rounded-lg bg-gray-50 cursor-move hover:bg-gray-100 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <h3 className="font-medium">{template.name}</h3>
      <p className="text-sm text-gray-500">Drag to add template</p>
    </div>
  );
};
