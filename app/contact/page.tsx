import PageHeader from '@/components/shared/PageHeader'
import ContactForm from '@/components/forms/ContactForm'

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact Us"
        description="Get in touch with our healthcare support team"
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto">
          <ContactForm />
        </div>
      </div>
    </>
  )
}