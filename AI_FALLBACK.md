# AI Provider Fallback System

## Overview

HireMind implements a robust AI provider fallback system that ensures reliable AI-powered features even when the primary provider (OpenAI) is unavailable or exceeds quota limits.

## How It Works

### Provider Priority

The system tries AI providers in a configurable priority order. By default:
1. **OpenAI** (Primary) - GPT-3.5-turbo or GPT-4
2. **Google Gemini** (Fallback) - Gemini 1.5 Flash

### Automatic Failover Logic

```
┌─────────────────────────────────────────────────────────┐
│  Request to generateText()                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  Try OpenAI (Primary)  │
        └──────┬─────────────────┘
               │
               ├─── Success? ──► Return result
               │
               └─── Failed with retryable error (429, 503, etc.)
                    │
                    ▼
        ┌────────────────────────┐
        │  Try Gemini (Fallback) │
        └──────┬─────────────────┘
               │
               ├─── Success? ──► Return result
               │
               └─── Failed? ──► Return error "All providers failed"
```

## Configuration

### Environment Variables

```env
# Primary Provider (OpenAI)
OPENAI_API_KEY=sk-...your-key...
OPENAI_MODEL=gpt-3.5-turbo

# Fallback Provider (Gemini)
GEMINI_API_KEY=...your-key...
GEMINI_MODEL=gemini-1.5-flash

# Provider Priority (optional)
AI_PROVIDER_PRIORITY=openai,gemini
```

### Provider Priority Configuration

You can customize the order in which providers are tried:

```env
# Default: Try OpenAI first, then Gemini
AI_PROVIDER_PRIORITY=openai,gemini

# Reverse: Try Gemini first, then OpenAI
AI_PROVIDER_PRIORITY=gemini,openai

# Single provider only
AI_PROVIDER_PRIORITY=openai
```

## Error Handling

### Retryable Errors

These errors trigger automatic fallback to the next provider:

- **429** - Rate limit exceeded / Quota exhausted
- **503** - Service unavailable
- **502** - Bad gateway
- **RESOURCE_EXHAUSTED** - Gemini quota error
- **ETIMEDOUT** - Network timeout
- **ECONNREFUSED** - Connection refused

### Non-Retryable Errors

These errors do NOT trigger fallback (but may try next provider for other reasons):

- **401** - Invalid API key (throws immediately)
- **400** - Bad request
- Other client errors

## Logging

The system provides detailed logging for monitoring and debugging:

```
✅ AI providers configured: OpenAI, Gemini
📋 Provider priority: openai → gemini
🚀 HireMind API server running on port 3001

🤖 Attempting generation with OpenAI...
❌ OpenAI failed: Request failed with status code 429
⚠️  Retryable error (429), trying next provider...

🤖 Attempting generation with Gemini...
✅ Successfully generated text with Gemini
```

### Log Interpretation

| Icon | Meaning |
|------|---------|
| ✅ | Success |
| 🤖 | Attempting AI generation |
| ❌ | Failure |
| ⚠️  | Warning / Retry |
| 📋 | Configuration info |
| 🚀 | Server started |

## API Keys

### Getting API Keys

#### OpenAI
1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and add to `.env` as `OPENAI_API_KEY`

#### Google Gemini
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API key"
4. Copy the key and add to `.env` as `GEMINI_API_KEY`

### Free Tier and Pricing

| Provider | Pricing Model | Rate Limits |
|----------|---------------|-------------|
| OpenAI | Pay-per-use (requires billing) | Varies by tier and model |
| Gemini | Free tier available | Varies by region and model |

**Important Notes:**
- **OpenAI**: Requires a paid account with billing information. Free trial credits are no longer available for new accounts as of April 2023. Check current pricing at https://openai.com/pricing
- **Gemini**: Offers a free tier with rate limits that vary by region and model. Check current limits at https://ai.google.dev/pricing
- All rate limits and pricing are subject to change. Always verify current information on official provider websites.

## Best Practices

### 1. Configure Multiple Providers

Always configure at least 2 providers for maximum reliability:

```env
OPENAI_API_KEY=your-openai-key
GEMINI_API_KEY=your-gemini-key
```

### 2. Monitor Provider Usage

Check backend logs to see which provider is handling requests:

```bash
cd backend
npm run dev
# Watch for 🤖 and ✅ emojis in console
```

### 3. Rotate Primary Provider

During development, you might want to use Gemini primarily to save OpenAI credits:

```env
AI_PROVIDER_PRIORITY=gemini,openai
```

### 4. Handle "All Providers Failed" Errors

In your frontend, handle the case where all providers fail:

```javascript
try {
  const result = await api.generateResume(userInfo);
} catch (error) {
  if (error.message.includes('All AI providers failed')) {
    // Show user-friendly message
    alert('AI services are temporarily unavailable. Please try again later.');
  }
}
```

## Testing the Fallback System

### Scenario 1: OpenAI Quota Exceeded

1. Configure both providers
2. Use up OpenAI quota
3. Make a request - should automatically use Gemini
4. Check logs for fallback confirmation

### Scenario 2: Single Provider Only

1. Configure only Gemini: `AI_PROVIDER_PRIORITY=gemini`
2. Make requests - all should use Gemini
3. Verify in logs

### Scenario 3: All Providers Fail

1. Use invalid API keys for both providers
2. Make a request - should fail with comprehensive error
3. Error message should list all attempted providers

## Troubleshooting

### "No AI provider API keys configured"

**Problem**: Neither OpenAI nor Gemini API key is set.

**Solution**: Add at least one API key to your `.env` file.

### "All AI providers failed"

**Problem**: All configured providers returned errors.

**Causes**:
- Invalid API keys
- Quota exceeded on all providers
- Network connectivity issues
- Service outages

**Solution**:
1. Check API keys are valid
2. Check quota limits on provider dashboards
3. Verify network connectivity
4. Check provider status pages:
   - OpenAI: https://status.openai.com/
   - Gemini: https://status.cloud.google.com/

### Provider Not Being Used

**Problem**: Configured provider is not being tried.

**Solution**:
1. Check `AI_PROVIDER_PRIORITY` order
2. Verify API key is set correctly
3. Restart backend server after `.env` changes
4. Check logs for provider initialization messages

## Code Implementation

### Key Functions

#### `generateText(prompt, systemMessage)`

Main function that implements the fallback logic. Tries each provider in priority order.

#### `generateTextWithOpenAI(prompt, systemMessage)`

OpenAI-specific implementation using the OpenAI SDK.

#### `generateTextWithGemini(prompt, systemMessage)`

Gemini-specific implementation using the Google Generative AI SDK.

#### `isRetryableError(error)`

Determines if an error should trigger fallback to next provider.

### Adding New Providers

To add a new AI provider (e.g., Anthropic Claude, Cohere):

1. Install the provider's SDK:
   ```bash
   npm install @anthropic-ai/sdk
   ```

2. Initialize the client in `aiService.js`:
   ```javascript
   const anthropic = process.env.ANTHROPIC_API_KEY
     ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
     : null;
   ```

3. Add provider-specific generation function:
   ```javascript
   async function generateTextWithAnthropic(prompt, systemMessage) {
     // Implementation using Anthropic SDK
   }
   ```

4. Add case to the switch statement in `generateText()`:
   ```javascript
   case 'anthropic':
     if (!anthropic) continue;
     result = await generateTextWithAnthropic(prompt, systemMessage);
     break;
   ```

5. Update environment variables and documentation

## Performance Considerations

### Latency

Different providers have different response times (approximate values under typical conditions):

- **OpenAI GPT-3.5**: ~2-5 seconds
- **Gemini 1.5 Flash**: ~1-3 seconds

**Note**: Response times may vary significantly based on request complexity, server load, geographic location, and network conditions. These are typical estimates and actual performance may differ.

Fallback adds latency only when primary provider fails.

### Cost

Provider pricing varies and is subject to change. Current pricing information:

- **OpenAI**: Pay-per-use model, approximately $0.50-$1.50 per 1M input/output tokens for GPT-3.5-turbo. For current pricing, see https://openai.com/pricing
- **Gemini**: Free tier available with rate limits, then pay-per-use. For current pricing, see https://ai.google.dev/pricing

**Important**: Always check official pricing pages for the most up-to-date information as rates and models evolve frequently.

### Reliability

With 2 providers configured:
- Single provider uptime: ~99.5%
- Dual provider uptime: ~99.9%+ (assuming independent failures)

## Support

For issues or questions:
- GitHub Issues: https://github.com/erzer12/HireMind/issues
- Check logs for detailed error messages
- Review this documentation
- Verify provider status pages
