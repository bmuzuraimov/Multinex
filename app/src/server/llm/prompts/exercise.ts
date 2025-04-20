import { exerciseFormat } from '../response_formats';

const MULTI_MODAL_LEARNING_PROMPT = `Act like a world-class cognitive scientist and learning expert specializing in rapid knowledge acquisition. Your task is to write a text to help someone learn a topic 10x faster than traditional methods.

The target audience is university students, and they need to grasp this topic efficiently and intuitively.
Neuroscience principles to consider:  
- Cognitive Load Theory: Don't overload each section; keep content manageable.  
- Dual Coding: Combine text and visuals.  
- Generation Effect: Writing from memory strengthens retention.  

Volumes in percentages: Type 30%, Mermaid 25%, Listen 20%, Write 25%.  

Each content section must follow this format with all 4 elements in this exact order:
1. TYPE - Active encoding that engages working memory through forced effort
2. MERMAID - Visual-spatial scaffolding that leverages the visuospatial sketchpad for dual coding
3. LISTEN - Auditory priming that activates the phonological loop
4. WRITE - Retrieval practice that strengthens synaptic plasticity through recall

Use exactly these tags and formats:

<type>The mitochondrion is the powerhouse of the cell, generating ATP through oxidative phosphorylation. This process requires oxygen and occurs in the inner mitochondrial membrane.</type>

<mermaid>graph LR  
A["Glycolysis"] --> B["Krebs Cycle"] --> C["ETC"] --> D["ATP"]  
B --> E["CO2"]  
C --> F["O2"]</mermaid>

<listen>Mitochondria convert glucose into ATP through three stages: glycolysis in the cytoplasm, the Krebs cycle in the matrix, and the electron transport chain in the inner membrane. Oxygen is the final electron acceptor.</listen>

<write>From memory, list the 3 main stages of cellular respiration and their ATP yields.</write>

Rules for each tag:
- <type>: Core factual content, clear and concise explanation of key concepts
- <mermaid>: Use flowcharts for processes or class diagrams for hierarchies, limit to 5-8 nodes per chart
- <listen>: Simplified, conversational version of the type content focusing on key relationships
- <write>: Specific questions or tasks that directly reference the content covered
`;

export const generateModulePrompt = ({
  context,
  topic_name,
  pre_prompt,
  post_prompt,
}: {
  context: string;
  topic_name: string;
  pre_prompt: string;
  post_prompt: string;
}): { messages: { role: 'user'; content: string }[]; response_format: any } => {
  const prompt = `${pre_prompt}
  ${MULTI_MODAL_LEARNING_PROMPT}
  Topic: ${topic_name}\n
  Context: ${context}\n
  ${post_prompt}`;

  return {
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: exerciseFormat,
  };
};
