import React from "react"
import IngredientsList from "/src/components/IngredientsList"
import ClaudeRecipe from "/src/components/ClaudeRecipe"
import { getRecipeFromMistral } from "/src/ai"

export default function Main() {
    function isAlphanumericWithSpace(str) {
        const regex = /^[a-zA-Z0-9 ]+$/;
        return regex.test(str);
    }

    const [inputError, setInputError] = React.useState(false)
    const [ingredients, setIngredients] = React.useState([])
    const [recipe, setRecipe] = React.useState("")

    async function getRecipe() {
        const recipeMarkdown = await getRecipeFromMistral(ingredients)
        setRecipe(recipeMarkdown)
    }

    function addIngredient(event) {
        event.preventDefault()

        const formData = new FormData(event.target)
        const newIngredient = formData.get("ingredient")
        
        if(isAlphanumericWithSpace(newIngredient)) {
            setIngredients(prevIngredients => [...prevIngredients, newIngredient])
            setInputError(prev => false)
        } else {
            setInputError(prev => true)
        }
    }

    return (
        <main>
            <form onSubmit={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button>Add ingredient</button>
            </form>

            {inputError && <p className="input-error">Please enter meaningful stuff.</p>}

            {ingredients.length > 0 &&
                <IngredientsList
                    ingredients={ingredients}
                    getRecipe={getRecipe}
                />
            }
            {recipe && <ClaudeRecipe recipe={recipe} />}
        </main>
    )
}