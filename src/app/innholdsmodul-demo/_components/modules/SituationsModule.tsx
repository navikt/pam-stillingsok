import { HStack, Tag } from "@navikt/ds-react";

type Props = {
    situations: string[];
};

const SituationsModule = ({ situations }: Props) => {
    if (situations.length === 0) {
        return null;
    }
    return (
        <div>
            <Tag variant="warning" size="xsmall" style={{ alignSelf: "flex-start" }}>
                SituationsModule
            </Tag>

            <HStack gap="space-2" wrap>
                {situations.map((situation) => (
                    <Tag key={situation} variant="neutral" size="small">
                        {situation}
                    </Tag>
                ))}
            </HStack>
        </div>
    );
};

export default SituationsModule;
