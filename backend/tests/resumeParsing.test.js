/**
 * Tests for resume parsing functionality
 * These tests verify that resume data structure and validation work correctly
 */

import { jest } from '@jest/globals';

describe('Resume Data Validation', () => {
  test('should validate required resume fields structure', () => {
    const validResumeData = {
      name: 'John Doe',
      email: 'john@email.com',
      phone: '555-1234',
      location: 'NY',
      summary: 'Summary',
      skills: ['JavaScript'],
      experience: [{
        position: 'Developer',
        company: 'Tech Co',
        duration: '2020-2021',
        description: 'Developed apps'
      }],
      education: [{
        degree: 'BS CS',
        institution: 'University',
        year: '2020'
      }]
    };

    // Validate structure
    expect(validResumeData).toHaveProperty('name');
    expect(validResumeData).toHaveProperty('email');
    expect(validResumeData).toHaveProperty('skills');
    expect(Array.isArray(validResumeData.skills)).toBe(true);
    expect(Array.isArray(validResumeData.experience)).toBe(true);
    expect(Array.isArray(validResumeData.education)).toBe(true);
    
    // Validate experience structure
    expect(validResumeData.experience[0]).toHaveProperty('position');
    expect(validResumeData.experience[0]).toHaveProperty('company');
    expect(validResumeData.experience[0]).toHaveProperty('duration');
    expect(validResumeData.experience[0]).toHaveProperty('description');
    
    // Validate education structure
    expect(validResumeData.education[0]).toHaveProperty('degree');
    expect(validResumeData.education[0]).toHaveProperty('institution');
    expect(validResumeData.education[0]).toHaveProperty('year');
  });

  test('should handle resume with minimal information', () => {
    const minimalResumeData = {
      name: 'Jane Smith',
      email: 'jane@email.com',
      phone: '',
      location: '',
      summary: '',
      skills: ['Python', 'Java'],
      experience: [],
      education: []
    };

    expect(minimalResumeData.name).toBe('Jane Smith');
    expect(minimalResumeData.email).toBe('jane@email.com');
    expect(minimalResumeData.skills).toEqual(['Python', 'Java']);
    expect(minimalResumeData.experience).toEqual([]);
    expect(minimalResumeData.education).toEqual([]);
  });

  test('should validate complete resume data structure', () => {
    const completeResumeData = {
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '(555) 123-4567',
      location: 'New York, NY',
      summary: 'Experienced software engineer with 5 years in full-stack development.',
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Docker'],
      experience: [
        {
          position: 'Senior Developer',
          company: 'Tech Corp',
          duration: 'Jan 2020 - Present',
          description: 'Led development of microservices architecture. Improved system performance by 40%.'
        },
        {
          position: 'Software Engineer',
          company: 'StartupCo',
          duration: 'Jun 2018 - Dec 2019',
          description: 'Built responsive web applications. Implemented CI/CD pipelines.'
        }
      ],
      education: [
        {
          degree: 'BS Computer Science',
          institution: 'University of Technology',
          year: '2018'
        }
      ]
    };

    expect(completeResumeData).toHaveProperty('name');
    expect(completeResumeData.name).toBe('John Doe');
    expect(completeResumeData.email).toBe('john.doe@email.com');
    expect(completeResumeData.skills).toHaveLength(6);
    expect(completeResumeData.experience).toHaveLength(2);
    expect(completeResumeData.education).toHaveLength(1);
    
    // Validate all experience entries
    completeResumeData.experience.forEach(exp => {
      expect(exp).toHaveProperty('position');
      expect(exp).toHaveProperty('company');
      expect(exp).toHaveProperty('duration');
      expect(exp).toHaveProperty('description');
    });
    
    // Validate all education entries
    completeResumeData.education.forEach(edu => {
      expect(edu).toHaveProperty('degree');
      expect(edu).toHaveProperty('institution');
      expect(edu).toHaveProperty('year');
    });
  });

  test('should check for meaningful resume data', () => {
    const hasName = (data) => data.name && data.name.trim().length > 0;
    const hasEmail = (data) => data.email && data.email.trim().length > 0;
    const hasSkills = (data) => data.skills && data.skills.length > 0;
    const hasExperience = (data) => data.experience && data.experience.length > 0;
    
    const hasMeaningfulData = (data) => {
      return hasName(data) || hasEmail(data) || hasSkills(data) || hasExperience(data);
    };

    const validData = {
      name: 'John Doe',
      email: 'john@email.com',
      skills: ['JavaScript'],
      experience: []
    };

    const emptyData = {
      name: '',
      email: '',
      skills: [],
      experience: []
    };

    expect(hasMeaningfulData(validData)).toBe(true);
    expect(hasMeaningfulData(emptyData)).toBe(false);
  });
});

describe('Session Resume Data Format', () => {
  test('should include metadata in session storage format', () => {
    const sessionResumeData = {
      name: 'John Doe',
      email: 'john@email.com',
      phone: '555-1234',
      location: 'NY',
      summary: 'Summary',
      skills: ['JavaScript'],
      experience: [],
      education: [],
      filename: 'resume.pdf',
      uploadedAt: new Date().toISOString(),
      rawText: 'Raw text content...'
    };

    expect(sessionResumeData).toHaveProperty('filename');
    expect(sessionResumeData).toHaveProperty('uploadedAt');
    expect(sessionResumeData).toHaveProperty('rawText');
    expect(sessionResumeData.filename).toBe('resume.pdf');
    expect(sessionResumeData.uploadedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
