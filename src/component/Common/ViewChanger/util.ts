export interface Props {
    text: string;
    actions: Array<{description: string, view: string}>;
    context: React.Context<{viewTracer: string[]; modifyViewTracer: (tracer: Array<string>) => void;}>
}