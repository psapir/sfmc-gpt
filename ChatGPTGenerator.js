<script runat=server>
    Platform.Load("Core","1");
    var variations = Variable.GetValue("@variations");
    var prompt = Variable.GetValue("@prompt");
    var maxTokens = Variable.GetValue("@maxTokens");
    var emailName = Attribute.GetValue("emailname_");
    
   try{
    
    if(!variations) variations = 5;
    if(!maxTokens) maxTokens = 256;
  
    var generatedContentDE = DataExtension.Init("ChatGPTGeneratedContent");
    var generatedContentRows = generatedContentDE.Rows.Lookup(["EmailName"], [emailName]);
    
    if (!generatedContentRows.length) {
       generatedContentRows = [];
        var url = 'https://api.openai.com/v1/completions';
        var contentType = 'application/json';
        var payload = '{ "model": "text-davinci-003", "prompt": "Write an alternative for this text: '+prompt+'", "temperature": 0.5, "max_tokens": '+maxTokens+',"n":'+variations+'}';
      
        var headerNames = ["Authorization"];
        var headerValues = ["Bearer YOUR_CHATGPT_API_GOES_HERE"];
        var result = HTTP.Post(url, "application/json", payload, headerNames, headerValues);
    
        var jsonResult = Platform.Function.ParseJSON(result.Response[0]);
        
        var resultsArray = jsonResult.choices;
        
        for (i = 0; i < resultsArray.length; i++) {
           generatedContentRows.push({EmailName:emailName,Variation:i+1,GeneratedText:resultsArray[i].text});

        }
        
        generatedContentDE.Rows.Add(generatedContentRows);
    }
    
    var variation = Math.floor(Math.random() * variations) ;
    var text = generatedContentRows[variation].GeneratedText;
     Variable.SetValue("@generatedContent", text);
     Variable.SetValue("@generatedContentAlias", emailName + "-" + variation);
    } 
    catch(e){
      Variable.SetValue("@generatedContent", prompt);
      Variable.SetValue("@generatedContentAlias", emailName + "-default");
    }
    
</script>
