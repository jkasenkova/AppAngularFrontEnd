export class Reference {
    public id?: string;
    public templateTopicId: string;
    public name: string;
    public description?: string;
    public enabled: boolean = false;
    public index: number = 0;
    public editing: boolean = false;
    public expand: boolean = false;
    public parentReferenceId?: string;
    public childReferences?: Reference[];
}
