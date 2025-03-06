export interface ActionStatusResponse {
    success: boolean;
}

export interface ActionResponse<Type> extends ActionStatusResponse {
    data?: Type;
}
