/**
 * American Airlines - Destinations Recommendations Transformer
 *
 * This Handlebars transformer renders personalized destination recommendations
 * in the "Today's Offers" content zone on the homepage.
 *
 * Upload this to: Personalization > Website Connector > Transformers
 */

const DestinationsTransformer = {
  name: 'DestinationsTransformer',
  transformerType: 'Handlebars',
  lastModifiedDate: new Date().getTime(),

  // Map Decisioning API response fields to template variables
  substitutionDefinitions: {
    // Section header from campaign attributes
    introText: { defaultValue: '[attributes].[introText]' },

    // Array of destination recommendations
    recs: { defaultValue: '[data]' },

    // Per-destination fields (adjust field names to match your Data Cloud schema)
    headerText: { defaultValue: '[HeaderText__c]' },
    description: { defaultValue: '[Description__c]' },
    imageUrl: { defaultValue: '[ImageURL__c]' },
    ctaText: { defaultValue: '[CTAText__c]' },
    ctaUrl: { defaultValue: '[CTAURL__c]' }
  },

  transformerTypeDetails: {
    html: `
      <section class="bg-gray-50 py-16 sfdcep-destinations">
        <div class="max-w-7xl mx-auto px-4">
          <!-- Section Header -->
          <h2 class="text-3xl md:text-4xl font-light mb-8" style="color: #0078D2;">
            {{subVar 'introText'}}
          </h2>

          <!-- Destinations Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {{#each (subVar 'recs')}}
              <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow sfdcep-destination-card">
                <!-- Destination Image -->
                <div class="h-56 overflow-hidden">
                  <img
                    src="{{subVar 'imageUrl'}}"
                    alt="{{subVar 'headerText'}}"
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onerror="this.src='https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=500&fit=crop'"
                  />
                </div>

                <!-- Destination Content -->
                <div class="p-6">
                  <h3 class="text-xl font-semibold text-gray-900 mb-3">
                    {{subVar 'headerText'}}
                  </h3>
                  <p class="text-gray-600 mb-4 leading-relaxed">
                    {{subVar 'description'}}
                  </p>
                  <a
                    href="{{subVar 'ctaUrl'}}"
                    class="font-medium flex items-center gap-1 hover:underline"
                    style="color: #0078D2;"
                  >
                    {{subVar 'ctaText'}}
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            {{/each}}
          </div>
        </div>
      </section>

      <style>
        .sfdcep-destinations {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .sfdcep-destination-card {
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .sfdcep-destination-card:hover {
          transform: translateY(-2px);
        }
      </style>
    `
  }
};

// Export for use in Personalization
// Copy everything below this line when uploading to Personalization:
// ----------------------------------------------------------------
/*
{
  name: 'DestinationsTransformer',
  transformerType: 'Handlebars',
  lastModifiedDate: 0,
  substitutionDefinitions: {
    introText: { defaultValue: '[attributes].[introText]' },
    recs: { defaultValue: '[data]' },
    headerText: { defaultValue: '[HeaderText__c]' },
    description: { defaultValue: '[Description__c]' },
    imageUrl: { defaultValue: '[ImageURL__c]' },
    ctaText: { defaultValue: '[CTAText__c]' },
    ctaUrl: { defaultValue: '[CTAURL__c]' }
  },
  transformerTypeDetails: {
    html: `
      <section class="bg-gray-50 py-16 sfdcep-destinations">
        <div class="max-w-7xl mx-auto px-4">
          <h2 class="text-3xl md:text-4xl font-light mb-8" style="color: #0078D2;">
            {{subVar 'introText'}}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {{#each (subVar 'recs')}}
              <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow sfdcep-destination-card">
                <div class="h-56 overflow-hidden">
                  <img src="{{subVar 'imageUrl'}}" alt="{{subVar 'headerText'}}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" onerror="this.src='https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=500&fit=crop'" />
                </div>
                <div class="p-6">
                  <h3 class="text-xl font-semibold text-gray-900 mb-3">{{subVar 'headerText'}}</h3>
                  <p class="text-gray-600 mb-4 leading-relaxed">{{subVar 'description'}}</p>
                  <a href="{{subVar 'ctaUrl'}}" class="font-medium flex items-center gap-1 hover:underline" style="color: #0078D2;">
                    {{subVar 'ctaText'}}
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                </div>
              </div>
            {{/each}}
          </div>
        </div>
      </section>
      <style>.sfdcep-destinations{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}.sfdcep-destination-card{transition:box-shadow .2s ease,transform .2s ease}.sfdcep-destination-card:hover{transform:translateY(-2px)}</style>
    `
  }
}
*/
