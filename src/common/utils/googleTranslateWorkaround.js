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
    if (typeof Node === "function" && Node.prototype) {
        const originalRemoveChild = Node.prototype.removeChild;
        Node.prototype.removeChild = function (child) {
            if (child.parentNode !== this) {
                if (console) {
                    console.error("Cannot remove a child from a different parent", child, this);
                }
                return child;
            }
            return originalRemoveChild.apply(this, arguments);
        };

        const originalInsertBefore = Node.prototype.insertBefore;
        Node.prototype.insertBefore = function (newNode, referenceNode) {
            if (referenceNode && referenceNode.parentNode !== this) {
                if (console) {
                    console.error("Cannot insert before a reference node from a different parent", referenceNode, this);
                }
                return newNode;
            }
            return originalInsertBefore.apply(this, arguments);
        };
    }
}
