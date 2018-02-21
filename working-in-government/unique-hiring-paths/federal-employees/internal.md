---
permalink: /working-in-government/unique-hiring-paths/federal-employees/internal/
layout: unique-hiring-path
section: working-in-government
title: Internal to an agency
breadcrumb: Internal
category: Unique Hiring Paths
tags: [internal, agency, hiring paths]
short-name: internal
---

{% assign hp_internal = site.data.unique-hiring-paths[page.short-name] %}

<div class="usajobs-uhp-section">
  <div class="usajobs-uhp-section__col-left">
    <h2 class="usajobs-uhp-section__title">Eligibility</h2>
  </div>
  <div class="usajobs-uhp-section__col-right">
    <p>
      You're eligible if you’re a current federal employee at the hiring agency.
    </p>
  </div>
</div>

<div class="usajobs-uhp-section">
  <div class="usajobs-uhp-section__col-left">
    <h2 class="usajobs-uhp-section__title">
      How do I know if a job is open internally?
    </h2>
  </div>
  <div class="usajobs-uhp-section__col-right">
    <p>
      In the job announcement look for the <strong>This job is open to</strong> section. When the job is open to current employees of the agency, you’ll see the internal icon <svg class="usajobs-icon--hiring-path usajobs-uhp-section__filters-uhp-icon {{ page.short-name }}" role="img"><title>Internal to an agency</title><use xlink:href="#{{ hp_internal.icon }}"></use></svg>. 
    </p>
    <p>
      There may be other groups listed that can also apply. Jobs are sometimes open internally only and sometimes internally as well as being open to other hiring paths. This is up to the agency's discretion.
    </p>
    <p>
      You can also select the <strong>Internal to an agency</strong> filter in <a href="{{ site.baseurl }}/how-to/search/filters/hiring-path/">search</a>. Your results will display all jobs open to current employees of the hiring agency.
    </p>
  </div>
</div>

{% include components/unique-hiring-paths/search-inner.html page=page.short-name %}
