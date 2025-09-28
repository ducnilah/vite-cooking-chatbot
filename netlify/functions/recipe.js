import { HfInference } from "@huggingface/inference"

const hf = new HfInference(process.env.HF_ACCESS_TOKEN)

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
`

export async function handler(event) {
  try {
    const body = JSON.parse(event.body)
    const ingredients = body.ingredients.join(", ")

    const response = await hf.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        { role: "system", content: SYSTEM_PROMPT},
        { role: "user", content: `I have ${ingredients}. Please give me a recipe!` }
      ],
      max_tokens: 1024
    })

    return {
      statusCode: 200,
      body: JSON.stringify({ recipe: response.choices[0].message.content })
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    }
  }
}
