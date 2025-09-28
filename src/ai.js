export async function getRecipeFromMistral(ingredientsArr) {
    try {
        const res = await fetch("/.netlify/functions/recipe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ingredients: ingredientsArr })
        })

        if (!res.ok) {
            throw new Error(`Server error: ${res.status}`)
        }

        const data = await res.json()
        return data.recipe
    } catch (err) {
        console.error("Error fetching recipe:", err)
        return null
    }
}
