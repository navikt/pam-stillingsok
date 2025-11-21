/**
 *  React og Google Translate (høyreklikk og velg Oversett til engelsk), men også andre plugins etc,
 *  bruker samme DOM i nettleseren.
 *  Vi har sett en del bugs hvor det er sannsynlig at jobbsøker bruker Google Translate.
 *  Når Google Translate oversetter, så endres samme DOM som også React bruker, og det hender at React kræsjer.
 *
 *  Dette er en workaround for å unngå dette. Les mer her:
 *  https://github.com/facebook/react/issues/11538#issuecomment-417504600
 */
export default function googleTranslateWorkaround() {
    if (typeof window === "undefined" || typeof document === "undefined") {
        return;
    }
    if (typeof Node === "function" && Node.prototype) {
        const originalRemoveChild = Node.prototype.removeChild;

        Node.prototype.removeChild = function <T extends Node>(child: T): T {
            if (child.parentNode !== this) {
                if (console) {
                    console.error("Cannot remove a child from a different parent", child, this);
                }
                return child;
            }
            return originalRemoveChild.apply(this, [child] as unknown as [T]) as T;
        };

        const originalInsertBefore = Node.prototype.insertBefore;

        Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
            if (referenceNode && referenceNode.parentNode !== this) {
                if (console) {
                    console.error("Cannot insert before a reference node from a different parent", referenceNode, this);
                }
                return newNode;
            }
            return originalInsertBefore.apply(this, [newNode, referenceNode] as unknown as [T, Node | null]) as T;
        };
    }
}
