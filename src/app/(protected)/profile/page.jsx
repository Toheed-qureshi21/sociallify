import { Card, CardHeader } from "@/components/ui/card";

export default function Profile() {
    return(
        <section className="w-screen h-screen flex items-center justify-center">
            <Card className="w-96 h-96 flex text-center">
                <CardHeader className="text-2xl font-bold">
                    Profile 
                </CardHeader>
            </Card>
        </section>
    )
}