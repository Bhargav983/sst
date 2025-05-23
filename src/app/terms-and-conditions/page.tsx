
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsAndConditionsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 md:py-12">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary">Terms and Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground/80 leading-relaxed">
            <p>Welcome to SutraCart! These terms and conditions outline the rules and regulations for the use of SutraCart's Website, located at [Your Website URL].</p>
            <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use SutraCart if you do not agree to take all of the terms and conditions stated on this page.</p>
            
            <h2 className="text-xl font-semibold text-foreground pt-4">Cookies</h2>
            <p>We employ the use of cookies. By accessing SutraCart, you agreed to use cookies in agreement with the SutraCart's Privacy Policy.</p>
            <p>Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.</p>

            <h2 className="text-xl font-semibold text-foreground pt-4">License</h2>
            <p>Unless otherwise stated, SutraCart and/or its licensors own the intellectual property rights for all material on SutraCart. All intellectual property rights are reserved. You may access this from SutraCart for your own personal use subjected to restrictions set in these terms and conditions.</p>
            <p>You must not:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Republish material from SutraCart</li>
              <li>Sell, rent or sub-license material from SutraCart</li>
              <li>Reproduce, duplicate or copy material from SutraCart</li>
              <li>Redistribute content from SutraCart</li>
            </ul>
            <p>This Agreement shall begin on the date hereof.</p>

            <h2 className="text-xl font-semibold text-foreground pt-4">User Comments</h2>
            <p>Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. SutraCart does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of SutraCart,its agents and/or affiliates. Comments reflect the views and opinions of the person who post their views and opinions.</p>

            <h2 className="text-xl font-semibold text-foreground pt-4">Disclaimer</h2>
            <p>To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>limit or exclude our or your liability for death or personal injury;</li>
              <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
              <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
              <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
            </ul>
            <p>The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.</p>
            <p>As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.</p>
            
            <p className="pt-6 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
