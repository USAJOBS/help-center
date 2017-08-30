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
      Your eligibility depends on whether the job you're applying to is in the <a href="{{ site.baseurl }}/working-in-government/service/#competitive-service">competitive service</a> or <a href="{{ site.baseurl }}/working-in-government/service/#excepted-service">excepted service</a>.
    </p>

    <h4>"Internal to the agency jobs" within the competitive service</h4>
    <p>
      If you're applying to a job in the competitive service, you must be <strong>one</strong> of the following:
    </p>
    <ul>
      <li>A current federal employee at the hiring agency and within the competitive service.</li>
      <li>An individual with a disability covered by <a href="{{ site.baseurl }}/working-in-government/unique-hiring-paths/individuals-with-disabilities/">schedule A</a>.</li>
    </ul>

    <h4>"Internal to the agency jobs" within the excepted service</h4>
    <p>
      If you're applying to a job in the excepted service, you must be <strong>one</strong> of the following:
    </p>
    <ul>
      <li>A current federal employee at the hiring agency.</li>
      <li>A former federal employee who is eligible for <a href="{{ site.baseurl }}/working-in-government/unique-hiring-paths/federal-employees/reinstatement/">reinstatement</a> with the hiring agency.</li>
    </ul>
  </div>
</div>

<div class="usajobs-uhp-section">
  <div class="usajobs-uhp-section__col-left">
    <h2 class="usajobs-uhp-section__title">
      How do I know if a job is open only internally?
    </h2>
  </div>
  <div class="usajobs-uhp-section__col-right">
    <p>
      In the job announcement look for the <strong>This job is open to</strong> section. When the job is open only to current employees of the agency, you’ll see the internal icon <span class="usajobs-uhp-section__filters-uhp-icon internal"><i class="fa fa-{{ hp_internal.icon }}"></i></span>. There may be other groups listed that can also apply.
    </p>
    <p>
      You can also select the <strong>Internal to an agency</strong> filter in search. Your results will display all jobs open only to current employees of the hiring agency.
    </p>
  </div>
</div>

{% include components/unique-hiring-paths/search-inner.html page=page.short-name %}
