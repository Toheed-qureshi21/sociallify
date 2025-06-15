import Link from "next/link";

export default function NotFound(){
return (
            <section className="h-lvh w-lvw flex justify-center items-center">
                    <div className="flex flex-col text-center gap-2">
                        <h2 className="text-2xl font-bold">Sorry, this page isn't available.</h2>
                        <p>Please check your URL or return to home.</p>
                        <Link href="/" className="mt-6 py-2  border border-blue-700 rounded-lg">Go to your feed</Link>
                    </div>
            </section>
    )
 }