export type Todo = {
    id: string,
    tags: string[],
    title: string,
    completed: boolean,
    createdOn: Date,
    completedOn: Date | null,
    description? : string,
}

export type Tag = {
    title: string, 
    color: string
}