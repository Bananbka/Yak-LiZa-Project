import { ProductClient } from "./product-client"

export async function generateStaticParams() {
    const products = await fetch('https://api.escuelajs.co/api/v1/products')
        .then(res => res.json())

    return products.slice(0, 20).map((product: any) => ({
        id: product.id.toString(),
    }))
}

export default function ProductPage({
                                        params,
                                    }: {
    params: { id: string }
}) {
    return <ProductClient params={params} />
}
