export const modelLabel = {
    // The model picked by default in voice-chat is the first one in models array (i.e., LLama Normal)
    models: [
        {label:'Llama Normal', value:'llama-normal'}, 
        {label:'Llama Finetune', value:'llama-finetune'}, 
        {label:'GPT4O MINI', value:'gpt-4o-mini'}, 
        // {label:'Bedrock', value:'bedrock'}, 
        // {label:'GPT4O', value:'gpt-4o'}, 
        // {label:'Groq Llama', value:'groq-llama'}, 
    ]
 }; 

 export const selectedLabel = {
    types: [
        {label:'Guided Reflection', value:'normal'}, 
        {label:'One-Step Reflection ', value:'oneshot'}, 
    ]
 }; 

 export const languageList = [
    {label:'English', value:'en'},
    {label:'Hindi', value:'hi'},
    {label:'Kannada', value:'kn'}
];