import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { CreateEnquiryDto } from './create-enquiry.dto';
import { EnquiriesService } from './enquiries.service';

@Controller('enquiries')
@UseGuards(ThrottlerGuard)
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  createEnquiry(
    @Body() enquiry: CreateEnquiryDto,
  ): Promise<{ message: 'Enquiry sent' }> {
    return this.enquiriesService.createEnquiry(enquiry);
  }
}
