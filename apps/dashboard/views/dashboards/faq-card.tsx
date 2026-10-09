import { RiQuestionLine } from '@remixicon/react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@workspace/ui/components/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'

import { faqItems } from '@/__mocks__/dashboard'

export function FaqCard(): React.ReactNode {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RiQuestionLine className="size-4 text-muted-foreground" />
          常見問答
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion>
          {faqItems.map(item => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
